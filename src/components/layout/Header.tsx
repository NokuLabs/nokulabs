'use client'

import { useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type Locale = 'ro' | 'en'

function swapLocaleInPath(pathname: string, next: Locale): string {
  if (!pathname) return `/${next}`
  const parts = pathname.split('/')
  if (parts.length >= 2 && (parts[1] === 'ro' || parts[1] === 'en')) {
    parts[1] = next
    return parts.join('/') || `/${next}`
  }
  return `/${next}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
}

export default function Header() {
  const locale    = useLocale() as Locale
  const pathname  = usePathname() || `/${locale}`
  const t         = useTranslations('header')
  const headerRef = useRef<HTMLElement>(null)

  // Progressive scroll-linked header — direct DOM writes, no React re-renders.
  // Background and blur fade in over the first 80px; border appears at 20px.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      const y = window.scrollY
      const p = Math.min(y / 80, 1)

      el.style.backgroundColor = p > 0 ? `rgba(10,10,10,${(p * 0.95).toFixed(3)})` : ''

      if (!mq.matches) {
        const blurVal = p > 0.05 ? `blur(${(p * 12).toFixed(1)}px)` : ''
        el.style.backdropFilter = blurVal
        ;(el.style as any).webkitBackdropFilter = blurVal
      }

      el.dataset.scrolled = y > 20 ? 'true' : 'false'
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const next: Locale = locale === 'ro' ? 'en' : 'ro'

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent transition-[border-color] duration-500 data-[scrolled=true]:border-border"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <a
            href={`/${locale}`}
            className="text-h4 font-mono font-semibold tracking-tight hover:text-accent transition-colors"
            aria-label={t('homeLabel')}
          >
            NOKU LABS
          </a>

          {/* Language toggle — link for better SEO and right-click behaviour */}
          <a
            href={swapLocaleInPath(pathname, next)}
            aria-label={t('switchLang')}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-border',
              'px-3 py-2 text-small font-medium',
              'bg-background/60 hover:bg-background/80 transition-colors'
            )}
          >
            <span className="text-secondary">{next.toUpperCase()}</span>
            <span className="w-px h-4 bg-border" aria-hidden="true" />
            <span className="text-primary">{locale.toUpperCase()}</span>
          </a>
        </div>
      </div>
    </header>
  )
}
