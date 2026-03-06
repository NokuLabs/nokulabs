'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import CubeNav from '@/components/interactive/CubeNav'
import type { CubeFace } from '@/components/interactive/CubeNav'
import ActiveSectionPanel from '@/components/interactive/ActiveSectionPanel'
import { useHomePanel } from '@/context/HomePanelContext'

export default function Hero() {
  const t = useTranslations('hero')

  const { activeFace, toggleFace } = useHomePanel()  
  const heroRef       = useRef<HTMLElement>(null)
  const panelRef      = useRef<HTMLDivElement>(null)
  const introRef      = useRef<HTMLDivElement>(null)
  const introMouseRef = useRef<HTMLDivElement>(null)   // inner mouse-depth layer
  const cubeWrapRef   = useRef<HTMLDivElement>(null)
  const cubeMouseRef  = useRef<HTMLDivElement>(null)   // inner mouse-depth layer
  const bgRef         = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLCanvasElement>(null)

  // ── Panel transition state ────────────────────────────────────────────────
  // panelFace: the face currently rendered in the DOM (lags activeFace by ~200ms
  //   during exit so the outgoing panel can animate before unmount)
  // isExiting: applies section-panel-exit class while old content leaves
  // displayedFaceRef: ref mirror of panelFace — readable inside effects without
  //   adding it as a dependency (avoids re-triggering the transition effect)
  // nextFaceRef: captures the latest activeFace target during rapid switching
  // exitTimerRef: the pending setTimeout so rapid clicks can cancel it
  const [panelFace, setPanelFace]     = useState<CubeFace | null>(null)
  const [isExiting, setIsExiting]     = useState(false)
  const displayedFaceRef              = useRef<CubeFace | null>(null)
  const nextFaceRef                   = useRef<CubeFace | null>(null)
  const exitTimerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Drive the enter / exit choreography whenever the context face changes.
  useEffect(() => {
    nextFaceRef.current = activeFace

    // Cancel any in-progress exit (handles rapid repeated clicks cleanly)
    if (exitTimerRef.current) { clearTimeout(exitTimerRef.current); exitTimerRef.current = null }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const current = displayedFaceRef.current

    // Nothing currently shown, or reduced motion — swap immediately, no choreography
    if (!current || reduced) {
      displayedFaceRef.current = activeFace
      setPanelFace(activeFace)
      setIsExiting(false)
      return
    }

    // Same face re-selected — clear any stale exit state, no content swap needed
    if (activeFace === current) {
      setIsExiting(false)
      return
    }

    // Trigger exit on the current panel, then swap content after it completes
    setIsExiting(true)
    exitTimerRef.current = setTimeout(() => {
      displayedFaceRef.current = nextFaceRef.current
      setPanelFace(nextFaceRef.current)
      setIsExiting(false)
    }, 200)
  }, [activeFace])

  // Scroll the panel into view whenever new content appears.
  // Fires on panelFace (not activeFace) so the scroll waits for the exit to
  // complete and the incoming section to mount before scrolling.
  useEffect(() => {
    if (!panelFace || !panelRef.current) return
    const timer = setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(timer)
  }, [panelFace])

  // Floating particle field — canvas drawn behind the hero, pure RAF
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width  = rect.width  || window.innerWidth
      canvas.height = rect.height || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Fewer particles on small screens — same atmosphere, lower GPU load
    const particleCount = window.innerWidth < 640 ? 12 : 28
    const particles = Array.from({ length: particleCount }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.10,
      vy: (Math.random() - 0.5) * 0.10,
      r:  0.5 + Math.random() * 1.0,
      a:  0.025 + Math.random() * 0.055,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Scroll parallax + Phase 2 scroll-reactive cube transforms.
  // All three layer parallax values remain; cube wrapper gains external
  // rotateY (orbital feel) and scale (depth recession).
  // Direct DOM writes — no React re-renders on scroll.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    // Motion factors — reduced on narrow viewports so the effect stays
    // premium on shorter scroll distances and lower-powered devices.
    const isMobile   = window.innerWidth < 640
    const ROT_FACTOR = isMobile ? 0.012 : 0.020   // additional °/px scrolled
    const SCALE_RATE = isMobile ? 0.00006 : 0.00009 // scale loss per px scrolled
    const SCALE_MIN  = 0.92                          // floor — never smaller than this

    let rafId   = 0
    let running = false
    let curr    = 0   // smoothed scroll value (lerped toward target)
    let target  = 0   // raw window.scrollY

    // Cached external transform values — updated only when not dragging.
    // Freezing during drag prevents the cube from jumping when drag starts,
    // and is safe because scroll cannot change while the pointer is captured
    // on the cube scene (touchAction:none blocks it on touch; pointer capture
    // prevents it on mouse).
    let extRotY  = 0
    let extScale = 1
    let isDragging = false

    const onPointerDown = () => { isDragging = true }
    const onPointerEnd  = () => { isDragging = false }
    const cubeEl = cubeWrapRef.current
    cubeEl?.addEventListener('pointerdown',   onPointerDown)
    cubeEl?.addEventListener('pointerup',     onPointerEnd)
    cubeEl?.addEventListener('pointercancel', onPointerEnd)

    const tick = () => {
      curr += (target - curr) * 0.09

      if (introRef.current) {
        introRef.current.style.transform = `translateY(${(curr * -0.10).toFixed(2)}px)`
      }

      if (cubeWrapRef.current) {
        // Only recompute external rotation / scale when the user is not dragging.
        // During drag the frozen values hold so the cube responds purely to touch.
        if (!isDragging) {
          extRotY  = curr * ROT_FACTOR
          extScale = Math.max(SCALE_MIN, 1 - curr * SCALE_RATE)
        }
        cubeWrapRef.current.style.transform =
          `translateY(${(curr * -0.04).toFixed(2)}px) ` +
          `rotateY(${extRotY.toFixed(3)}deg) ` +
          `scale(${extScale.toFixed(4)})`
      }

      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${(curr * 0.05).toFixed(2)}px)`
      }

      if (Math.abs(target - curr) > 0.05) {
        rafId = requestAnimationFrame(tick)
      } else {
        curr = target
        running = false
      }
    }

    const onScroll = () => {
      target = window.scrollY
      if (!running) { running = true; rafId = requestAnimationFrame(tick) }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
      cubeEl?.removeEventListener('pointerdown',   onPointerDown)
      cubeEl?.removeEventListener('pointerup',     onPointerEnd)
      cubeEl?.removeEventListener('pointercancel', onPointerEnd)
    }
  }, [])

  // Mouse-position depth parallax — desktop only, compositor-friendly.
  // introMouseRef and cubeMouseRef are inner wrappers that receive only the
  // mouse offset transform; the outer refs (introRef, cubeWrapRef) continue
  // to own scroll-driven transforms. The two layers never conflict.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Fine pointer = mouse. Coarse / none = touch or stylus without hover.
    if (!window.matchMedia('(pointer: fine)').matches) return

    const hero = heroRef.current
    if (!hero) return

    let rafId   = 0
    let running = false
    let targetX = 0, targetY = 0
    let currX   = 0, currY   = 0
    const LERP  = 0.055  // silky pull — lower = slower, more cinematic

    const tick = () => {
      currX += (targetX - currX) * LERP
      currY += (targetY - currY) * LERP

      // Intro: foreground layer — follows cursor, slightly larger range
      if (introMouseRef.current) {
        introMouseRef.current.style.transform =
          `translate(${(currX * 4).toFixed(2)}px, ${(currY * 2).toFixed(2)}px)`
      }
      // Cube: midground — moves opposite for depth separation, smaller range
      if (cubeMouseRef.current) {
        cubeMouseRef.current.style.transform =
          `translate(${(-currX * 2).toFixed(2)}px, ${(-currY * 1).toFixed(2)}px)`
      }

      if (Math.abs(targetX - currX) > 0.002 || Math.abs(targetY - currY) > 0.002) {
        rafId = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      targetX = Math.max(-1, Math.min(1, (e.clientX - rect.left  - rect.width  * 0.5) / (rect.width  * 0.5)))
      targetY = Math.max(-1, Math.min(1, (e.clientY - rect.top   - rect.height * 0.5) / (rect.height * 0.5)))
      if (!running) { running = true; rafId = requestAnimationFrame(tick) }
    }

    // Smoothly return to center when cursor leaves the hero
    const onMouseLeave = () => {
      targetX = 0; targetY = 0
      if (!running) { running = true; rafId = requestAnimationFrame(tick) }
    }

    hero.addEventListener('mousemove',  onMouseMove,  { passive: true })
    hero.addEventListener('mouseleave', onMouseLeave, { passive: true })
    return () => {
      hero.removeEventListener('mousemove',  onMouseMove)
      hero.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* ── Particle canvas — atmospheric dust field ────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        />

        {/* ── Background atmospheric layers (slow parallax) ───────────────── */}
        <div ref={bgRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true">
          {/* Structural grid */}
          <div className="absolute inset-0 grid-background opacity-[0.55]" />
          {/* Central radial light source — gives the background dimensionality */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 46%, rgba(255,255,255,0.018) 0%, rgba(210,218,255,0.007) 42%, transparent 68%)',
            }}
          />
        </div>

        {/* ── Edge vignette + depth gradient ──────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background:
              'linear-gradient(to bottom, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.22) 16%, transparent 40%, transparent 62%, rgba(10,10,10,0.38) 84%, rgba(10,10,10,0.80) 100%), ' +
              'radial-gradient(ellipse 105% 88% at 50% 50%, transparent 40%, rgba(0,0,0,0.52) 100%)',
          }}
          aria-hidden="true"
        />

        {/* ── Scan line — single light sweep for cinematic texture ────────── */}
        <div className="hero-scan-line" style={{ zIndex: 3 }} aria-hidden="true" />

        {/* ── Content stack ───────────────────────────────────────────────── */}
        <div
          className="relative w-full flex flex-col items-center gap-10 md:gap-14 px-6 lg:px-12 pt-28 pb-16 md:pb-20"
          style={{ zIndex: 10 }}
        >

          {/* ── Editorial intro ─────────────────────────────────────────── */}
          {/* Outer: scroll parallax + opacity dim on activeFace            */}
          {/* Inner: mouse depth offset (separate RAF, no transform conflict) */}
          <div
            ref={introRef}
            className={`hero-intro${activeFace ? ' hero-intro--dimmed' : ''}`}
            style={{ willChange: 'transform' }}
          >
            <div
              ref={introMouseRef}
              className="flex flex-col items-center text-center gap-4"
            >
              {/* Brand eyebrow — decorative, language-neutral */}
              <div
                className="hero-line-enter flex items-center gap-4"
                style={{ animationDelay: '0.0s' }}
                aria-hidden="true"
              >
                <span className="w-8 h-px bg-primary/18" />
                <span className="text-[10px] font-mono tracking-[0.38em] text-primary/25 uppercase select-none">
                  NOKU LABS
                </span>
                <span className="w-8 h-px bg-primary/18" />
              </div>

              {/* Headline — LCP, never animated directly */}
              <h1
                id="hero-title"
                className="hero-line-enter text-2xl sm:text-3xl md:text-[2.6rem] font-semibold tracking-tight text-balance leading-tight max-w-2xl"
                style={{ animationDelay: '0.10s' }}
              >
                {t('h1')}
              </h1>

              {/* Subheadline */}
              <p
                className="hero-line-enter text-sm md:text-base text-primary/50 text-balance max-w-lg leading-relaxed"
                style={{ animationDelay: '0.22s' }}
              >
                {t('sub')}
              </p>

              {/* ── CTAs + trust ──────────────────────────────────────── */}
              <div
                className="hero-line-enter flex flex-col items-center gap-5 pt-2"
                style={{ animationDelay: '0.55s' }}
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" onClick={() => toggleFace('contact')}>
                    {t('ctaPrimary')}
                  </Button>
                  <Button variant="secondary" onClick={() => toggleFace('approach')}>
                    {t('ctaSecondary')}
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <p className="text-[11px] font-mono tracking-[0.18em] text-primary/30 uppercase">
                    {t('trustLine')}
                  </p>
                  <p className="text-[11px] font-mono tracking-[0.18em] text-primary/30 uppercase">
                    {t('secondTrustLine')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Cube stage — primary immersive object ───────────────────── */}
          {/* Outer: scroll parallax + entrance animation                    */}
          {/* Inner: mouse depth offset (opposite direction from intro)       */}
          <div
            ref={cubeWrapRef}
            className="cube-cinema-enter relative"
            style={{ willChange: 'transform' }}
          >
            <div ref={cubeMouseRef}>
              {/* Atmospheric glow orb — breathes behind the cube */}
              <div className="hero-cube-glow" aria-hidden="true" />

              <div className="hidden sm:block" style={{ position: 'relative', zIndex: 1 }}>
                <CubeNav size={560} onFaceSelect={(face: CubeFace) => toggleFace(face)} />
              </div>
              <div className="sm:hidden" style={{ position: 'relative', zIndex: 1 }}>
                <CubeNav size={320} onFaceSelect={(face: CubeFace) => toggleFace(face)} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Inline section panel ─────────────────────────────────────────── */}
      {panelFace && (
        <div ref={panelRef} className="panel-bridge">
          <div key={panelFace} className={isExiting ? 'section-panel-exit' : 'section-panel-enter'}>
            <ActiveSectionPanel face={panelFace} />
          </div>
        </div>
      )}
    </>
  )
}
