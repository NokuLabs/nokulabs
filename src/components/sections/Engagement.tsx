'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ContactForm from '@/components/ui/ContactForm'
import { fadeUpVariants, staggerContainerVariants } from '@/components/motion/variants'

type Lang = 'en' | 'ro'
const STORAGE_KEY = 'noku_lang'

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'ro' || saved === 'en') return saved
  const prefersRo = window.navigator.language?.toLowerCase().startsWith('ro')
  return prefersRo ? 'ro' : 'en'
}

const COPY: Record<Lang, { title: string; p1: string; p2a: string; p2b: string }> = {
  en: {
    title: 'Request an Architecture Review.',
    p1: `This is a qualification gate — not a generic contact form. We’ll review your context, identify risk areas, and reply with a recommended next step.`,
    p2a: 'Expected response window: ',
    p2b: '. If your request is time-sensitive, specify it in the submission.',
  },
  ro: {
    title: 'Solicită un Architecture Review.',
    p1: `Acesta este un filtru de calificare — nu un formular generic. Analizăm contextul, identificăm zone de risc și revenim cu un pas recomandat.`,
    p2a: 'Fereastră estimată de răspuns: ',
    p2b: '. Dacă solicitarea este urgentă, menționează clar în trimitere.',
  },
}

export default function Engagement() {
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

  const c = useMemo(() => COPY[lang], [lang])

  return (
    <section
      id="engagement"
      className="py-section-mobile md:py-section-desktop px-6 lg:px-12 bg-surface"
      aria-labelledby="engagement-title"
    >
      <div className="max-w-content mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainerVariants}
        >
          <motion.h2
            id="engagement-title"
            className="text-h2-mobile md:text-h2-desktop mb-6"
            variants={fadeUpVariants}
          >
            {c.title}
          </motion.h2>

          <motion.p className="text-body-lg text-secondary mb-6" variants={fadeUpVariants}>
            {c.p1}
          </motion.p>

          <motion.p className="text-body text-secondary" variants={fadeUpVariants}>
            {c.p2a}
            <span className="text-primary">24–48 {lang === 'ro' ? 'ore' : 'hours'}</span>
            {c.p2b}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUpVariants}
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}