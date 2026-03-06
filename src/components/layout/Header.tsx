'use client'

import { useEffect, useState } from 'react'
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
  const locale   = useLocale() as Locale
  const pathname = usePathname() || `/${locale}`
  const t        = useTranslations('header')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const next: Locale = locale === 'ro' ? 'en' : 'ro'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      )}
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
