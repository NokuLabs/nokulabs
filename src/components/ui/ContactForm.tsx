'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import Button from './Button'

type Step = 1 | 2 | 3
type Lang = 'en' | 'ro'

const STORAGE_KEY = 'noku_lang'

type LeadPayload = {
  org: string
  email: string
  budget: string
  timeline: string
  summary: string
  honeypot: string
  startedAt: number
}

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'ro' || saved === 'en') return saved
  const prefersRo = window.navigator.language?.toLowerCase().startsWith('ro')
  return prefersRo ? 'ro' : 'en'
}

const COPY = {
  en: {
    gate: 'Qualification gate',
    step: (n: number) => `Qualification gate • Step ${n} of 3`,
    response: 'Response: 24–48h',
    orgLabel: 'Organization / Institution',
    orgPh: 'e.g., Municipality / Public authority / Private enterprise',
    emailLabel: 'Work email',
    emailPh: 'name@organization.tld',
    emailHint: 'Personal email is accepted (soft filter), but organizational email gets prioritized.',
    continue: 'Continue',
    needOrgEmail: 'Provide an organization and a valid email to continue.',
    budgetLabel: 'Budget range',
    timelineLabel: 'Timeline',
    contextLabel: 'Context summary',
    min: (m: number) => `(minimum ${m} chars)`,
    contextPh: 'What environment is this for? Current stack? Constraints? Risks? What does success look like?',
    hint: 'We respond faster to concrete constraints, scope, and risk signals.',
    back: 'Back',
    submit: 'Submit for review',
    submitting: 'Submitting…',
    receivedTitle: 'Received.',
    receivedBody: `Your request is in the queue. If additional details are required, we’ll reply to your email.`,
    receivedFoot: 'Typical response window: 24–48 hours.',
    missingEndpoint: 'Missing form endpoint (NEXT_PUBLIC_LEAD_ENDPOINT).',
    rejected: 'Submission rejected. Please retry.',
    complete: (m: number) => `Please complete the form. Summary must be at least ${m} characters.`,
    failed: 'Submission failed. Please try again.',
    network: 'Network error. Please try again.',
  },
  ro: {
    gate: 'Filtru de calificare',
    step: (n: number) => `Filtru de calificare • Pasul ${n} din 3`,
    response: 'Răspuns: 24–48h',
    orgLabel: 'Organizație / Instituție',
    orgPh: 'ex.: Primărie / Autoritate publică / Companie privată',
    emailLabel: 'Email de serviciu',
    emailPh: 'nume@organizatie.tld',
    emailHint: 'Email personal este acceptat (filtru soft), dar email-ul organizației are prioritate.',
    continue: 'Continuă',
    needOrgEmail: 'Completează organizația și un email valid ca să continui.',
    budgetLabel: 'Buget',
    timelineLabel: 'Orizont de timp',
    contextLabel: 'Context',
    min: (m: number) => `(minim ${m} caractere)`,
    contextPh: 'Pentru ce mediu este? Stack curent? Constrângeri? Riscuri? Cum arată succesul?',
    hint: 'Răspundem mai rapid când există constrângeri clare, scope și semnale de risc.',
    back: 'Înapoi',
    submit: 'Trimite pentru analiză',
    submitting: 'Se trimite…',
    receivedTitle: 'Primit.',
    receivedBody: 'Cererea ta e în coadă. Dacă avem nevoie de clarificări, revenim pe email.',
    receivedFoot: 'Fereastră tipică de răspuns: 24–48 ore.',
    missingEndpoint: 'Lipsește endpoint-ul (NEXT_PUBLIC_LEAD_ENDPOINT).',
    rejected: 'Trimiterea a fost respinsă. Reîncearcă.',
    complete: (m: number) => `Completează formularul. Contextul trebuie să aibă minim ${m} caractere.`,
    failed: 'Trimiterea a eșuat. Reîncearcă.',
    network: 'Eroare de rețea. Reîncearcă.',
  },
} as const

const budgetsByLang = {
  en: ['< €10k', '€10k–€25k', '€25k–€75k', '€75k+'],
  ro: ['< €10k', '€10k–€25k', '€25k–€75k', '€75k+'],
} as const

const timelinesByLang = {
  en: ['ASAP (0–2 weeks)', '2–6 weeks', '2–3 months', '3–6 months', '6+ months'],
  ro: ['ASAP (0–2 săptămâni)', '2–6 săptămâni', '2–3 luni', '3–6 luni', '6+ luni'],
} as const

function isLikelyEmail(email: string) {
  const e = email.trim()
  if (e.length < 6 || e.length > 254) return false
  if (!e.includes('@')) return false
  const [, domain] = e.split('@')
  return Boolean(domain && domain.includes('.'))
}

export default function ContactForm() {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT

  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    setLang(getInitialLang())
    const onLang = (e: Event) => {
      const detail = (e as CustomEvent).detail as { lang?: Lang } | undefined
      if (detail?.lang === 'en' || detail?.lang === 'ro') setLang(detail.lang)
      else setLang(getInitialLang())
    }
    window.addEventListener('noku-lang-change', onLang as EventListener)
    return () => window.removeEventListener('noku-lang-change', onLang as EventListener)
  }, [])

  const t = COPY[lang]
  const budgets = budgetsByLang[lang]
  const timelines = timelinesByLang[lang]

  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const startedAtRef = useRef<number>(Date.now())

  const [payload, setPayload] = useState<LeadPayload>({
    org: '',
    email: '',
    budget: budgetsByLang.en[1], // stable default value
    timeline: timelinesByLang.en[2],
    summary: '',
    honeypot: '',
    startedAt: startedAtRef.current,
  })

  // keep select values aligned when switching lang
  useEffect(() => {
    setPayload((p) => ({
      ...p,
      budget: (budgets as readonly string[]).includes(p.budget) ? p.budget : budgets[1],
      timeline: (timelines as readonly string[]).includes(p.timeline) ? p.timeline : timelines[2],
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const minSummaryChars = 120

  const canGoStep2 = useMemo(() => {
    return payload.org.trim().length >= 2 && isLikelyEmail(payload.email)
  }, [payload.org, payload.email])

  const canSubmit = useMemo(() => {
    return canGoStep2 && payload.summary.trim().length >= minSummaryChars && !isSubmitting
  }, [canGoStep2, payload.summary, isSubmitting])

  function next() {
    setStatus('idle')
    setErrorMsg('')
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s))
  }

  function back() {
    setStatus('idle')
    setErrorMsg('')
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('idle')
    setErrorMsg('')

    if (!endpoint) {
      setStatus('error')
      setErrorMsg(t.missingEndpoint)
      return
    }

    if (payload.honeypot) {
      setStatus('success')
      setStep(3)
      return
    }

    const elapsedMs = Date.now() - payload.startedAt
    if (elapsedMs < 1800) {
      setStatus('error')
      setErrorMsg(t.rejected)
      return
    }

    if (!canSubmit) {
      setStatus('error')
      setErrorMsg(t.complete(minSummaryChars))
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          org: payload.org.trim(),
          email: payload.email.trim(),
          budget: payload.budget,
          timeline: payload.timeline,
          summary: payload.summary.trim(),
          honeypot: payload.honeypot,
          startedAt: payload.startedAt,
          lang,
        }),
      })

      const data = await res.json().catch(() => ({} as any))
      if (!res.ok || (data as any)?.ok === false) {
        setStatus('error')
        setErrorMsg((data as any)?.message || t.failed)
        return
      }

      setStatus('success')
      setStep(3)
    } catch {
      setStatus('error')
      setErrorMsg(t.network)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
      <div className="border border-border p-6 md:p-10 bg-background">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-small text-muted">{t.step(step)}</p>
          <p className="text-small text-muted">{t.response}</p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-small text-muted mb-2">{t.orgLabel}</label>
              <input
                value={payload.org}
                onChange={(e) => setPayload((p) => ({ ...p, org: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-border text-primary"
                placeholder={t.orgPh}
                autoComplete="organization"
                required
              />
            </div>

            <div>
              <label className="block text-small text-muted mb-2">{t.emailLabel}</label>
              <input
                type="email"
                value={payload.email}
                onChange={(e) => setPayload((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-border text-primary"
                placeholder={t.emailPh}
                autoComplete="email"
                inputMode="email"
                required
              />
              <p className="text-small text-muted mt-2">{t.emailHint}</p>
            </div>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label>Company website</label>
              <input
                tabIndex={-1}
                value={payload.honeypot}
                onChange={(e) => setPayload((p) => ({ ...p, honeypot: e.target.value }))}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={next}
                disabled={!canGoStep2}
                aria-label={t.continue}
              >
                {t.continue}
              </Button>
            </div>

            {!canGoStep2 && <p className="text-small text-muted">{t.needOrgEmail}</p>}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-small text-muted mb-2">{t.budgetLabel}</label>
                <select
                  value={payload.budget}
                  onChange={(e) => setPayload((p) => ({ ...p, budget: e.target.value }))}
                  className="w-full px-4 py-3 bg-background border border-border text-primary"
                >
                  {budgets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-small text-muted mb-2">{t.timelineLabel}</label>
                <select
                  value={payload.timeline}
                  onChange={(e) => setPayload((p) => ({ ...p, timeline: e.target.value }))}
                  className="w-full px-4 py-3 bg-background border border-border text-primary"
                >
                  {timelines.map((tt) => (
                    <option key={tt} value={tt}>
                      {tt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-small text-muted mb-2">
                {t.contextLabel} <span className="text-muted">{t.min(minSummaryChars)}</span>
              </label>
              <textarea
                value={payload.summary}
                onChange={(e) => setPayload((p) => ({ ...p, summary: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-border text-primary min-h-[160px]"
                placeholder={t.contextPh}
                required
              />
              <div className="flex justify-between mt-2">
                <p className="text-small text-muted">{t.hint}</p>
                <p className="text-small text-muted">
                  {payload.summary.trim().length}/{minSummaryChars}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={back}>
                {t.back}
              </Button>
              <Button type="submit" variant="primary" disabled={!canSubmit}>
                {isSubmitting ? t.submitting : t.submit}
              </Button>
            </div>

            {status === 'error' && (
              <p className="text-small text-muted" role="status">
                {errorMsg}
              </p>
            )}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <h3 className="text-h3-mobile md:text-h3-desktop">{t.receivedTitle}</h3>
            <p className="text-body text-secondary">{t.receivedBody}</p>
            <p className="text-small text-muted">{t.receivedFoot}</p>
          </div>
        )}
      </div>
    </form>
  )
}