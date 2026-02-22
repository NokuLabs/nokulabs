'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types'

const navItems: NavItem[] = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Approach', href: '#approach' },
  { label: 'Reference Work', href: '#systems' },
  { label: 'Contact', href: '#engagement' },
]

export default function Header() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isScrolled, setIsScrolled] = useState(false)

  const sectionIds = useMemo(
    () => ['hero', ...navItems.map((n) => n.href.replace('#', ''))],
    []
  )

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0]

        if (visible?.target?.id) setActiveSection(visible.target.id)
      },
      {
        root: null,
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0.1, 0.2, 0.35, 0.5, 0.75],
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [sectionIds])

  return (
    <header
      className={cn(
        // ✅ avoid transition-all + avoid backdrop-filter (expensive / non-composited)
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        isScrolled ? 'bg-background/95 border-b border-border' : 'bg-transparent'
      )}
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <a
            href="#hero"
            className="text-h4 font-mono font-semibold tracking-tight hover:text-accent transition-colors"
            aria-label="NOKU LABS home"
          >
            NOKU LABS
          </a>

          <nav className="hidden md:block" aria-label="Primary navigation">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const id = item.href.replace('#', '')
                const isActive = activeSection === id

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'text-body font-medium transition-colors relative group focus:outline-none',
                        isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          'absolute bottom-0 left-0 w-0 h-px bg-primary transition-[width] duration-300 group-hover:w-full',
                          isActive && 'w-full'
                        )}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}