'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Wraps the below-hero section area.
 *
 * On every client-side route change:
 *  1. The keyed div remounts → CSS enter animation plays automatically.
 *  2. Smoothly scrolls to #main-content so the new section comes into view.
 *
 * The first render (initial page load) is skipped for scroll so the user is
 * not forcibly pulled down when sharing a deep link.
 *
 * Respects prefers-reduced-motion for scroll behaviour.
 */
export default function SectionTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // /ro → 1 segment → home; /ro/security → 2 segments → sub-route
  const isHome = pathname.split('/').filter(Boolean).length <= 1

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (isHome) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const t = setTimeout(() => {
      document.getElementById('main-content')?.scrollIntoView({
        behavior: mq.matches ? 'auto' : 'smooth',
        block: 'start',
      })
    }, 80)
    return () => clearTimeout(t)
  }, [pathname, isHome])

  return (
    // key change causes React to unmount + remount → CSS animation triggers
    <div key={pathname} className={isHome ? undefined : 'section-transition'}>
      {children}
    </div>
  )
}
