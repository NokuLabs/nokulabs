'use client'

import { FormEvent, Fragment, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

// ─── Const arrays → derive union types ────────────────────────────────────────

const PROJECT_TYPES = [
  'custom-development',
  'automation',
  'ai-integration',
  'security-hardening',
  'system-architecture',
  'other',
] as const
type ProjectType = (typeof PROJECT_TYPES)[number]

const BUDGETS = ['< €10k', '€10k–€25k', '€25k–€75k', '€75k+'] as const
type Budget = (typeof BUDGETS)[number]

const TIMELINES = [
  '< 2 weeks',
  '2–6 weeks',
  '2–3 months',
  '3–6 months',
  '6+ months',
] as const
type Timeline = (typeof TIMELINES)[number]

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3
type StepDir = 'forward' | 'back'

type WizardPayload = {
  name:        string
  surname:     string
  company:     string
  email:       string
  phone:       string
  projectType: ProjectType
  budget:      Budget
  timeline:    Timeline
  notes:       string     // step 2: technical / design notes
  additional:  string     // step 3: anything else
  honeypot:    string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  const e = email.trim()
  if (e.length < 5 || e.length > 254 || !e.includes('@')) return false
  const [, domain] = e.split('@')
  if (!domain || !domain.includes('.')) return false
  return domain.split('.').at(-1)!.length >= 2
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactWizard() {
  const t = useTranslations('wizard')

  const [step, setStep]           = useState<WizardStep>(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [emailError, setEmailError] = useState(false)

  // Direction for step transition animation — written before setStep, read during render
  const stepDirRef   = useRef<StepDir>('forward')
  const containerRef = useRef<HTMLDivElement>(null)
  const startedAt    = useRef(Date.now())

  const [payload, setPayload] = useState<WizardPayload>({
    name: '', surname: '', company: '', email: '', phone: '',
    projectType: 'custom-development',
    budget:   BUDGETS[1],    // '€10k–€25k'
    timeline: TIMELINES[2],  // '2–3 months'
    notes: '', additional: '', honeypot: '',
  })

  // ── Focus first interactive element on step change ──────────────────────────
  const prevStep = useRef(step)
  if (prevStep.current !== step) {
    prevStep.current = step
  }

  // ── Field setter (typed by key) ────────────────────────────────────────────
  function set<K extends keyof WizardPayload>(k: K, v: WizardPayload[K]) {
    setPayload(p => ({ ...p, [k]: v } as WizardPayload))
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  const canGoStep2 =
    payload.name.trim().length >= 1 &&
    payload.surname.trim().length >= 1 &&
    isValidEmail(payload.email)

  function goNext(e?: FormEvent) {
    e?.preventDefault()
    if (step === 1) {
      if (!isValidEmail(payload.email)) { setEmailError(true); return }
      setEmailError(false)
    }
    if (step < 3) {
      stepDirRef.current = 'forward'
      setStep(s => (s + 1) as WizardStep)
    }
  }

  function goBack() {
    stepDirRef.current = 'back'
    setStep(s => Math.max(1, s - 1) as WizardStep)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Bot trap
    if (payload.honeypot) { setSubmitted(true); return }

    const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT
    setSubmitting(true)
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            name:      payload.name.trim(),
            surname:   payload.surname.trim(),
            email:     payload.email.trim(),
            startedAt: startedAt.current,
          }),
        })
        if (!res.ok) throw new Error('non-ok')
      } else {
        // No endpoint configured — mock for static demo
        console.log('[ContactWizard] submitted', payload)
        await new Promise(r => setTimeout(r, 600))
      }
      setSubmitted(true)
    } catch {
      // Fail gracefully — show confirmation anyway to avoid blocking the user
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Confirmation ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        ref={containerRef}
        className="wizard-done wizard-step wizard-step--enter-forward"
        role="status"
        tabIndex={-1}
      >
        <p className="wizard-done-title">{t('doneTitle')}</p>
        <p className="wizard-done-body">{t('doneBody')}</p>
      </div>
    )
  }

  // ── Wizard ─────────────────────────────────────────────────────────────────
  return (
    <div className="wizard-wrapper">

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      <div className="wizard-progress" aria-label={t('stepOf', { n: step })}>
        <div className="wizard-progress-track">
          {([1, 2, 3] as WizardStep[]).map((n, i) => (
            <Fragment key={n}>
              {i > 0 && (
                <div
                  className={`wizard-progress-line${n <= step ? ' wizard-progress-line--active' : ''}`}
                />
              )}
              <div
                className={`wizard-progress-dot${n <= step ? ' wizard-progress-dot--active' : ''}`}
                aria-hidden="true"
              />
            </Fragment>
          ))}
        </div>
        <span className="wizard-progress-label">{t('stepOf', { n: step })}</span>
      </div>

      {/* ── Step content (key change triggers remount + enter animation) ── */}
      <div
        key={step}
        ref={containerRef}
        className={`wizard-step wizard-step--enter-${stepDirRef.current}`}
      >

        {/* ── Step 1 — Identity ────────────────────────────────────────── */}
        {step === 1 && (
          <form onSubmit={goNext} noValidate>
            <div className="wizard-fields">

              <div className="wizard-row-2col">
                <div className="wizard-field">
                  <input
                    className="wizard-input"
                    value={payload.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder={t('namePh')}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="wizard-field">
                  <input
                    className="wizard-input"
                    value={payload.surname}
                    onChange={e => set('surname', e.target.value)}
                    placeholder={t('surnamePh')}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="wizard-field">
                <input
                  className="wizard-input"
                  value={payload.company}
                  onChange={e => set('company', e.target.value)}
                  placeholder={t('companyPh')}
                  autoComplete="organization"
                />
              </div>

              <div className="wizard-field">
                <input
                  type="email"
                  className={`wizard-input${emailError ? ' wizard-input--error' : ''}`}
                  value={payload.email}
                  onChange={e => {
                    set('email', e.target.value)
                    if (emailError) setEmailError(false)
                  }}
                  placeholder={t('emailPh')}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
                {emailError && (
                  <p className="wizard-field-error" role="alert">{t('emailErr')}</p>
                )}
              </div>

              <div className="wizard-field">
                <input
                  type="tel"
                  className="wizard-input"
                  value={payload.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder={t('phonePh')}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              {/* Honeypot — hidden from humans */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  tabIndex={-1}
                  value={payload.honeypot}
                  onChange={e => set('honeypot', e.target.value)}
                  autoComplete="off"
                />
              </div>

            </div>

            <div className="wizard-actions wizard-actions--end">
              <button
                type="submit"
                className="wizard-btn wizard-btn--primary"
                disabled={!canGoStep2}
              >
                {t('continue')}
              </button>
            </div>
          </form>
        )}

        {/* ── Step 2 — Project details ──────────────────────────────────── */}
        {step === 2 && (
          <form onSubmit={goNext} noValidate>
            <div className="wizard-fields">

              <div className="wizard-field">
                <label className="wizard-label">{t('projectTypeLabel')}</label>
                <select
                  className="wizard-input wizard-select"
                  value={payload.projectType}
                  onChange={e => set('projectType', e.target.value as ProjectType)}
                >
                  {PROJECT_TYPES.map(pt => (
                    <option key={pt} value={pt}>
                      {t(`projectTypes.${pt}` as any)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="wizard-row-2col">
                <div className="wizard-field">
                  <label className="wizard-label">{t('budgetLabel')}</label>
                  <select
                    className="wizard-input wizard-select"
                    value={payload.budget}
                    onChange={e => set('budget', e.target.value as Budget)}
                  >
                    {BUDGETS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">{t('timelineLabel')}</label>
                  <select
                    className="wizard-input wizard-select"
                    value={payload.timeline}
                    onChange={e => set('timeline', e.target.value as Timeline)}
                  >
                    {TIMELINES.map(tl => (
                      <option key={tl} value={tl}>{tl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="wizard-field">
                <label className="wizard-label">{t('notesLabel')}</label>
                <textarea
                  className="wizard-input wizard-textarea"
                  value={payload.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder={t('notesPh')}
                  rows={4}
                />
              </div>

            </div>

            <div className="wizard-actions wizard-actions--between">
              <button type="button" className="wizard-btn wizard-btn--ghost" onClick={goBack}>
                {t('back')}
              </button>
              <button type="submit" className="wizard-btn wizard-btn--primary">
                {t('continue')}
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3 — Final notes + submit ─────────────────────────────── */}
        {step === 3 && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="wizard-fields">

              <div className="wizard-field">
                <label className="wizard-label">{t('additionalLabel')}</label>
                <textarea
                  className="wizard-input wizard-textarea"
                  value={payload.additional}
                  onChange={e => set('additional', e.target.value)}
                  placeholder={t('additionalPh')}
                  rows={4}
                />
              </div>

            </div>

            <div className="wizard-actions wizard-actions--between">
              <button type="button" className="wizard-btn wizard-btn--ghost" onClick={goBack}>
                {t('back')}
              </button>
              <button
                type="submit"
                className="wizard-btn wizard-btn--primary"
                disabled={submitting}
              >
                {submitting ? t('submitting') : t('submit')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
