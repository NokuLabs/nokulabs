'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Fires once when the referenced element enters the viewport.
 * Respects prefers-reduced-motion — resolves immediately if motion is disabled.
 * Designed for section card stagger reveals inside the inline panel system.
 */
export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.08) {
  const ref     = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip animation for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
