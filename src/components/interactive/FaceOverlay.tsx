'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CubeFace } from '@/components/interactive/CubeNav'
import ContactWizard from '@/components/interactive/ContactWizard'

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = 'ro' | 'en'

interface FaceContent {
  title: string
  tag: string
  body: string
  cta: { label: string; href: string }
}

// ─── Bilingual content for every face ────────────────────────────────────────

const CONTENT: Record<CubeFace, { en: FaceContent; ro: FaceContent }> = {
  about: {
    en: {
      title: 'About',
      tag: '01 / About',
      body: 'NOKU Labs is a small, focused team building infrastructure-grade software for organizations where reliability is non-negotiable. We work on a limited number of engagements at a time — your project gets full attention.',
      cta: { label: 'Work with us', href: '#engagement' },
    },
    ro: {
      title: 'Despre',
      tag: '01 / Despre',
      body: 'NOKU Labs este o echipă mică și concentrată care construiește software de nivel infrastructural pentru organizații unde fiabilitatea este nenegociabilă. Lucrăm pe un număr limitat de proiecte — proiectul tău primește atenție completă.',
      cta: { label: 'Lucrează cu noi', href: '#engagement' },
    },
  },
  capabilities: {
    en: {
      title: 'Capabilities',
      tag: '02 / Capabilities',
      body: 'Custom software development · Automation engineering · AI workflow integration · Security hardening · System architecture · Compliance readiness. We own outcomes, not just deliverables.',
      cta: { label: 'Discuss your project', href: '#engagement' },
    },
    ro: {
      title: 'Capabilități',
      tag: '02 / Capabilități',
      body: 'Dezvoltare software custom · Automatizări · Integrare AI · Hardening de securitate · Arhitectură de sistem · Pregătire pentru conformitate. Asumăm rezultatele, nu doar livrabilele.',
      cta: { label: 'Discută proiectul', href: '#engagement' },
    },
  },
  portfolio: {
    en: {
      title: 'Portfolio',
      tag: '03 / Portfolio',
      body: 'Most of our work is under NDA — as it should be for regulated-industry software. We span finance, logistics, and critical infrastructure. We are happy to discuss patterns, constraints, and outcomes in a direct conversation.',
      cta: { label: 'Start a conversation', href: '#engagement' },
    },
    ro: {
      title: 'Portofoliu',
      tag: '03 / Portofoliu',
      body: 'Cea mai mare parte a lucrărilor noastre este sub NDA — cum este normal pentru software din industrii reglementate. Acoperim finanțe, logistică și infrastructură critică. Suntem bucuroși să discutăm tipare, constrângeri și rezultate.',
      cta: { label: 'Începe o conversație', href: '#engagement' },
    },
  },
  approach: {
    en: {
      title: 'Approach',
      tag: '04 / Approach',
      body: 'We start from constraints, not features. Every architectural decision traces back to a real operational requirement. We write for the engineer who maintains this in production at 3 AM — not for the demo.',
      cta: { label: 'See how we engage', href: '#engagement' },
    },
    ro: {
      title: 'Abordare',
      tag: '04 / Abordare',
      body: 'Pornim de la constrângeri, nu de la funcționalități. Fiecare decizie arhitecturală se leagă de o cerință operațională reală. Scriem pentru inginerul care menține sistemul în producție la ora 3 noaptea — nu pentru demo.',
      cta: { label: 'Cum colaborăm', href: '#engagement' },
    },
  },
  security: {
    en: {
      title: 'Security',
      tag: '05 / Security',
      body: 'Security is engineered in from day one — never retrofitted. Threat modeling, secure architecture, dependency hardening, and compliance-ready documentation for organizations operating under regulatory scrutiny.',
      cta: { label: 'Discuss security needs', href: '#engagement' },
    },
    ro: {
      title: 'Securitate',
      tag: '05 / Securitate',
      body: 'Securitatea este integrată din prima zi — nu adăugată ulterior. Modelare amenințări, arhitectură securizată, hardening al dependențelor și documentație conformă pentru organizații sub supraveghere regulatorie.',
      cta: { label: 'Discută nevoile de securitate', href: '#engagement' },
    },
  },
  contact: {
    en: {
      title: 'Contact',
      tag: '06 / Contact',
      body: "Tell us about your project. We respond within 24 hours and don't do sales calls. If there's a fit, we'll know quickly — and we'll be direct about it either way.",
      cta: { label: 'Open the contact form', href: '#engagement' },
    },
    ro: {
      title: 'Contact',
      tag: '06 / Contact',
      body: 'Spune-ne despre proiectul tău. Răspundem în 24h și nu facem apeluri de vânzări. Dacă există compatibilitate, o aflăm rapid — și suntem direcți indiferent de răspuns.',
      cta: { label: 'Deschide formularul de contact', href: '#engagement' },
    },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface FaceOverlayProps {
  face: CubeFace
  onClose: () => void
}

export default function FaceOverlay({ face, onClose }: FaceOverlayProps) {
  const [closing, setClosing]   = useState(false)
  const [lang, setLang]         = useState<Lang>('ro')
  const [mounted, setMounted]   = useState(false)

  const cardRef       = useRef<HTMLDivElement>(null)
  const prevFocusRef  = useRef<Element | null>(null)
  const closingRef    = useRef(false)

  // Stable refs — updated every render, read at call-time (no stale closures)
  const onCloseRef    = useRef(onClose)
  onCloseRef.current  = onClose
  const startCloseRef = useRef<() => void>(() => {})

  // ── Mount guard (createPortal is client-only) ──────────────────────────────
  useEffect(() => { setMounted(true) }, [])

  // ── Remember focused element before overlay steals focus ──────────────────
  useEffect(() => {
    prevFocusRef.current = document.activeElement
  }, [])

  // ── Language sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('noku_lang')
    if (saved === 'en' || saved === 'ro') setLang(saved)

    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent<{ lang?: Lang }>).detail
      if (detail?.lang === 'en' || detail?.lang === 'ro') setLang(detail.lang)
    }
    window.addEventListener('noku-lang-change', onLangChange)
    return () => window.removeEventListener('noku-lang-change', onLangChange)
  }, [])

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // ── Initial focus ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || !cardRef.current) return
    const el = cardRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    el?.focus()
  }, [mounted])

  // ── ESC key (reads startCloseRef to avoid stale closure) ──────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        startCloseRef.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // ── startClose — updated each render via ref ───────────────────────────────
  function startClose() {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)

    const prevEl  = prevFocusRef.current as HTMLElement | null
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay   = reduced ? 0 : 200

    setTimeout(() => {
      onCloseRef.current()
      // Return focus to previous element (or cube) after React re-renders
      requestAnimationFrame(() => {
        if (prevEl && typeof prevEl.focus === 'function') {
          prevEl.focus()
        } else {
          (document.querySelector('.cube-scene') as HTMLElement | null)?.focus()
        }
      })
    }, delay)
  }
  startCloseRef.current = startClose

  // ── Focus trap ─────────────────────────────────────────────────────────────
  function onCardKeyDown(e: React.KeyboardEvent) {
    if (e.key !== 'Tab' || !cardRef.current) return
    const focusable = Array.from(
      cardRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const content = CONTENT[face][lang]

  if (!mounted) return null

  return createPortal(
    <div
      className={`overlay-backdrop${closing ? ' overlay-backdrop--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      onClick={(e) => { if (e.target === e.currentTarget) startCloseRef.current() }}
    >
      <div
        ref={cardRef}
        className={`overlay-card${closing ? ' overlay-card--closing' : ''}`}
        onKeyDown={onCardKeyDown}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="overlay-header">
          <span className="overlay-tag">{content.tag}</span>
          <button
            className="overlay-close"
            onClick={() => startCloseRef.current()}
            aria-label={lang === 'ro' ? 'Închide' : 'Close'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* ── Body / Wizard ─────────────────────────────────────────────── */}
        {face === 'contact' ? (
          <ContactWizard />
        ) : (
          <>
            <div className="overlay-body">
              <h2 className="overlay-title">{content.title}</h2>
              <p className="overlay-text">{content.body}</p>
            </div>

            <div className="overlay-footer">
              <a
                href={content.cta.href}
                className="overlay-cta"
                onClick={() => startCloseRef.current()}
              >
                {content.cta.label}
              </a>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}
