'use client'

import { FormEvent, useMemo, useRef, useState } from 'react'
import Button from './Button'

type Step = 1 | 2 | 3

type LeadPayload = {
  org: string
  email: string
  budget: string
  timeline: string
  summary: string
  honeypot: string
  startedAt: number
}

const budgets = ['< €10k', '€10k–€25k', '€25k–€75k', '€75k+'] as const
const timelines = ['ASAP (0–2 weeks)', '2–6 weeks', '2–3 months', '3–6 months', '6+ months'] as const

function isLikelyEmail(email: string) {
  const e = email.trim()
  if (e.length < 6 || e.length > 254) return false
  if (!e.includes('@')) return false
  const [_, domain] = e.split('@')
  return Boolean(domain && domain.includes('.'))
}

export default function ContactForm() {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT

  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const startedAtRef = useRef<number>(Date.now())

  const [payload, setPayload] = useState<LeadPayload>({
    org: '',
    email: '',
    budget: '€10k–€25k',
    timeline: '2–3 months',
    summary: '',
    honeypot: '',
    startedAt: startedAtRef.current,
  })

  const minSummaryChars = 120

  const canGoStep2 = useMemo(() => {
    return payload.org.trim().length >= 2 && isLikelyEmail(payload.email)
  }, [payload.org, payload.email])

  const canSubmit = useMemo(() => {
    return (
      canGoStep2 &&
      payload.summary.trim().length >= minSummaryChars &&
      !isSubmitting
    )
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

    // Hard stop: missing endpoint
    if (!endpoint) {
      setStatus('error')
      setErrorMsg('Missing form endpoint (NEXT_PUBLIC_LEAD_ENDPOINT).')
      return
    }

    // Honeypot: silent success
    if (payload.honeypot) {
      setStatus('success')
      return
    }

    // Timing defense (soft): bots submit too fast
    const elapsedMs = Date.now() - payload.startedAt
    if (elapsedMs < 1800) {
      setStatus('error')
      setErrorMsg('Submission rejected. Please retry.')
      return
    }

    if (!canSubmit) {
      setStatus('error')
      setErrorMsg(`Please complete the form. Summary must be at least ${minSummaryChars} characters.`)
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
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || data?.ok === false) {
        setStatus('error')
        setErrorMsg(data?.message || 'Submission failed. Please try again.')
        return
      }

      setStatus('success')
      setStep(3)
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
      <div className="border border-border p-6 md:p-10 bg-background">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-small text-muted">
            Qualification gate • Step {step} of 3
          </p>
          <p className="text-small text-muted">
            Response: 24–48h
          </p>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-small text-muted mb-2">Organization / Institution</label>
              <input
                value={payload.org}
                onChange={(e) => setPayload((p) => ({ ...p, org: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-border text-primary"
                placeholder="e.g., DSP Olt / Municipality / Private enterprise"
                autoComplete="organization"
                required
              />
            </div>

            <div>
              <label className="block text-small text-muted mb-2">Work email</label>
              <input
                value={payload.email}
                onChange={(e) => setPayload((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-border text-primary"
                placeholder="name@organization.tld"
                autoComplete="email"
                inputMode="email"
                required
              />
              <p className="text-small text-muted mt-2">
                Personal email is accepted (soft filter), but organizational email gets prioritized.
              </p>
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
                aria-label="Continue"
              >
                Continue
              </Button>
            </div>

            {!canGoStep2 && (
              <p className="text-small text-muted">
                Provide an organization and a valid email to continue.
              </p>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-small text-muted mb-2">Budget range</label>
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
                <label className="block text-small text-muted mb-2">Timeline</label>
                <select
                  value={payload.timeline}
                  onChange={(e) => setPayload((p) => ({ ...p, timeline: e.target.value }))}
                  className="w-full px-4 py-3 bg-background border border-border text-primary"
                >
                  {timelines.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-small text-muted mb-2">
                Context summary <span className="text-muted">(minimum {minSummaryChars} chars)</span>
              </label>
              <textarea
                value={payload.summary}
                onChange={(e) => setPayload((p) => ({ ...p, summary: e.target.value }))}
                className="w-full px-4 py-3 bg-background border border-border text-primary min-h-[160px]"
                placeholder="What environment is this for? Current stack? Constraints? Risks? What does success look like?"
                required
              />
              <div className="flex justify-between mt-2">
                <p className="text-small text-muted">
                  We respond faster to concrete constraints, scope, and risk signals.
                </p>
                <p className="text-small text-muted">
                  {payload.summary.trim().length}/{minSummaryChars}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={back}>
                Back
              </Button>
              <Button type="submit" variant="primary" disabled={!canSubmit}>
                {isSubmitting ? 'Submitting…' : 'Submit for review'}
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
            <h3 className="text-h3-mobile md:text-h3-desktop">Received.</h3>
            <p className="text-body text-secondary">
              Your request is in the queue. If additional details are required, we’ll reply to your email.
            </p>
            <p className="text-small text-muted">
              Typical response window: 24–48 hours.
            </p>
          </div>
        )}
      </div>
    </form>
  )
}