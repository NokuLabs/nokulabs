/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Receives the lead payload from the contact wizard,
 * validates it, and sends a notification email via Resend.
 *
 * Environment variables (set as Cloudflare secrets):
 *   RESEND_API_KEY     — your Resend API key
 *   TURNSTILE_SECRET   — Cloudflare Turnstile secret key
 */

interface Env {
  RESEND_API_KEY:   string
  TURNSTILE_SECRET: string
}

interface LeadPayload {
  name?:        string
  surname?:     string
  company?:     string
  email?:       string
  phone?:       string
  projectType?: string
  budget?:      string
  timeline?:    string
  notes?:       string
  additional?:  string
  honeypot?:       string
  startedAt?:      number
  turnstileToken?: string
}

// ── Lead scoring ──────────────────────────────────────────────────────────────

type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

function scoreLead(p: LeadPayload): number {
  let score = 0

  // Budget — biggest signal (0–40 pts)
  if      (p.budget === '€75k+')      score += 40
  else if (p.budget === '€25k–€75k')  score += 25
  else if (p.budget === '€10k–€25k')  score += 10
  // '< €10k' → 0

  // Project type — complexity proxy (0–20 pts)
  if (p.projectType === 'system-architecture') score += 20
  else if (p.projectType === 'security-hardening') score += 18
  else if (p.projectType === 'ai-integration')     score += 15
  else if (p.projectType === 'automation')          score += 12
  else if (p.projectType === 'custom-development')  score += 10
  // 'other' → 0

  // Company present — indicates professional context (10 pts)
  if (p.company?.trim()) score += 10

  // Notes + additional detail — effort signal (0–20 pts)
  const detailLen = (p.notes?.length ?? 0) + (p.additional?.length ?? 0)
  if      (detailLen >= 200) score += 20
  else if (detailLen >= 80)  score += 12
  else if (detailLen >= 20)  score += 5

  // Timeline — realistic windows score higher (0–10 pts)
  if      (p.timeline === '2–3 months')  score += 10
  else if (p.timeline === '3–6 months')  score += 10
  else if (p.timeline === '2–6 weeks')   score += 7
  else if (p.timeline === '6+ months')   score += 5
  // '< 2 weeks' → 0 (unrealistic urgency is a risk flag)

  return score
}

function classifyLead(score: number): Priority {
  if (score >= 55) return 'HIGH'
  if (score >= 25) return 'MEDIUM'
  return 'LOW'
}

function assessmentLine(priority: Priority): string {
  if (priority === 'HIGH')   return 'Assessment:    Strong fit — prioritise response'
  if (priority === 'MEDIUM') return 'Assessment:    Standard fit — follow up within 48h'
  return                            'Assessment:    Low fit — respond if capacity allows'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isValidEmail(email: string): boolean {
  const e = email.trim()
  if (e.length < 5 || e.length > 254 || !e.includes('@')) return false
  const [, domain] = e.split('@')
  if (!domain || !domain.includes('.')) return false
  return (domain.split('.').at(-1) ?? '').length >= 2
}

function buildEmailBody(p: LeadPayload, score: number, priority: Priority): string {
  const elapsed =
    typeof p.startedAt === 'number'
      ? Math.round((Date.now() - p.startedAt) / 1000)
      : null

  const lines: (string | null)[] = [
    `Priority:      ${priority}  (score: ${score})`,
    assessmentLine(priority),
    '',
    `Name:          ${p.name} ${p.surname}`,
    p.company    ? `Company:       ${p.company}`    : null,
    `Email:         ${p.email}`,
    p.phone      ? `Phone:         ${p.phone}`      : null,
    '',
    `Project type:  ${p.projectType ?? '—'}`,
    `Budget:        ${p.budget      ?? '—'}`,
    `Timeline:      ${p.timeline    ?? '—'}`,
    p.notes      ? `\nTechnical notes:\n${p.notes}`           : null,
    p.additional ? `\nAdditional context:\n${p.additional}`   : null,
    elapsed !== null ? `\nTime on form: ${elapsed}s`           : null,
  ]

  return lines.filter((l): l is string => l !== null).join('\n')
}

// ── POST handler ──────────────────────────────────────────────────────────────

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> => {
  // Parse body
  let payload: LeadPayload
  try {
    payload = (await request.json()) as LeadPayload
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400)
  }

  // Bot trap — silently accept so bots receive no signal
  if (payload.honeypot) {
    return jsonResponse({ ok: true })
  }

  // Turnstile verification
  if (!payload.turnstileToken) {
    return jsonResponse({ ok: false, error: 'turnstile_missing' }, 422)
  }
  const tsVerify = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({
        secret:   env.TURNSTILE_SECRET,
        response: payload.turnstileToken,
      }),
    },
  )
  const tsResult = (await tsVerify.json()) as { success: boolean }
  if (!tsResult.success) {
    return jsonResponse({ ok: false, error: 'turnstile_failed' }, 403)
  }

  // Field validation
  if (!payload.name?.trim())
    return jsonResponse({ ok: false, error: 'name_required' }, 422)
  if (!payload.surname?.trim())
    return jsonResponse({ ok: false, error: 'surname_required' }, 422)
  if (!payload.email?.trim())
    return jsonResponse({ ok: false, error: 'email_required' }, 422)
  if (!isValidEmail(payload.email))
    return jsonResponse({ ok: false, error: 'email_invalid' }, 422)

  // Fail fast if the secret is missing — misconfigured deployment
  if (!env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY is not configured')
    return jsonResponse({ ok: false, error: 'server_misconfigured' }, 500)
  }

  // Score and classify the lead
  const score    = scoreLead(payload)
  const priority = classifyLead(score)

  // Send via Resend
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:     'NOKU Labs <leads@nokulabs.com>',
      to:       'contact@nokulabs.com',
      reply_to: payload.email!.trim(),
      subject:  `[${priority}] New lead — ${payload.name.trim()} ${payload.surname.trim()}`,
      text:     buildEmailBody(payload, score, priority),
    }),
  })

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => '')
    console.error('[contact] Resend error', resendRes.status, detail)
    return jsonResponse({ ok: false, error: 'send_failed' }, 502)
  }

  return jsonResponse({ ok: true })
}

// ── OPTIONS — CORS preflight ──────────────────────────────────────────────────
// Frontend and function share the same origin so CORS is not strictly needed,
// but explicit headers are included for completeness.

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  'https://nokulabs.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
