'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CubeFace =
  | 'about'
  | 'capabilities'
  | 'portfolio'
  | 'approach'
  | 'security'
  | 'contact'

type Lang = 'ro' | 'en'

export interface CubeNavProps {
  onFaceSelect?: (face: CubeFace) => void
  /** Side length in px (default 280). */
  size?: number
}

// ─── Static data ─────────────────────────────────────────────────────────────
//
// IMPORTANT: Every array below is indexed in the same order:
//   0 → front (about)       1 → back  (capabilities)
//   2 → left  (portfolio)   3 → right (approach)
//   4 → top   (security)    5 → bottom (contact)
//
// If you re-order FACES you MUST re-order FACE_NORMALS and SNAP_TARGETS too.

const FACES: { id: CubeFace; en: string; ro: string; tag: string }[] = [
  { id: 'about',        en: 'About',        ro: 'Despre',       tag: '01' },
  { id: 'capabilities', en: 'Capabilities', ro: 'Capabilități',  tag: '02' },
  { id: 'portfolio',    en: 'Portfolio',    ro: 'Portofoliu',    tag: '03' },
  { id: 'approach',     en: 'Approach',     ro: 'Abordare',      tag: '04' },
  { id: 'security',     en: 'Security',     ro: 'Securitate',    tag: '05' },
  { id: 'contact',      en: 'Contact',      ro: 'Contact',       tag: '06' },
]

const FACE_SLOTS = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const
type FaceSlot = (typeof FACE_SLOTS)[number]

/**
 * Each face's outward normal in the CUBE's local space.
 * Derivation: the face panel's own normal is (0,0,1); applying the face's
 * slot transform (slotTransform) rotates it to its local direction:
 *   front  → (0, 0, 1)  back   → (0, 0,−1)
 *   left   → (−1,0, 0)  right  → (1, 0, 0)
 *   top    → (0, 1, 0)  bottom → (0,−1, 0)
 */
const FACE_NORMALS: readonly [number, number, number][] = [
  [ 0,  0,  1],  // 0 front
  [ 0,  0, -1],  // 1 back
  [-1,  0,  0],  // 2 left
  [ 1,  0,  0],  // 3 right
  [ 0,  1,  0],  // 4 top
  [ 0, -1,  0],  // 5 bottom
]

/**
 * Target cube rotation (degrees) that brings each face perfectly to the front.
 *
 * Verified with: z'' = y·sinRx − x·sinRy·cosRx + z·cosRy·cosRx = 1
 * CSS processes `rotateX(rx) rotateY(ry)` as M = Rx·Ry, so a vector is
 * transformed as v_world = Rx · (Ry · v_local).
 */
const SNAP_TARGETS: readonly { rx: number; ry: number }[] = [
  { rx:   0, ry:   0 },  // 0 front  → about
  { rx:   0, ry: 180 },  // 1 back   → capabilities
  { rx:   0, ry:  90 },  // 2 left   → portfolio
  { rx:   0, ry: -90 },  // 3 right  → approach
  { rx:  90, ry:   0 },  // 4 top    → security
  { rx: -90, ry:   0 },  // 5 bottom → contact
]

// ─── Pure geometry helpers ────────────────────────────────────────────────────

/**
 * Returns the index (0–5) of the face whose world-space normal has the
 * largest Z component (i.e. most facing the camera).
 *
 * World-space Z of face i:
 *   z'' = y·sin(rx) − x·sin(ry)·cos(rx) + z·cos(ry)·cos(rx)
 */
function computeActiveFaceIdx(rxDeg: number, ryDeg: number): number {
  const rx = (rxDeg * Math.PI) / 180
  const ry = (ryDeg * Math.PI) / 180
  const sinRx = Math.sin(rx)
  const cosRx = Math.cos(rx)
  const sinRy = Math.sin(ry)
  const cosRy = Math.cos(ry)

  let best = 0
  let bestDot = -Infinity
  for (let i = 0; i < FACE_NORMALS.length; i++) {
    const [x, y, z] = FACE_NORMALS[i]
    const dot = y * sinRx - x * sinRy * cosRx + z * cosRy * cosRx
    if (dot > bestDot) {
      bestDot = dot
      best = i
    }
  }
  return best
}

/**
 * Returns the angle equivalent to `target` that is closest to `current`.
 * Prevents the cube spinning the "long way round" during snap animation.
 */
function shortestAngle(current: number, target: number): number {
  const diff = ((target - current) % 360 + 540) % 360 - 180
  return current + diff
}

/** CSS position transform for each face slot (applied to the face panel itself). */
function slotTransform(slot: FaceSlot, half: number): string {
  switch (slot) {
    case 'front':  return `translateZ(${half}px)`
    case 'back':   return `rotateY(180deg) translateZ(${half}px)`
    case 'left':   return `rotateY(-90deg) translateZ(${half}px)`
    case 'right':  return `rotateY(90deg) translateZ(${half}px)`
    case 'top':    return `rotateX(90deg) translateZ(${half}px)`
    case 'bottom': return `rotateX(-90deg) translateZ(${half}px)`
  }
}

/** Ease-in-out cubic — smooth deceleration into the snap target. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Clamp X rotation during drag/inertia.
 * Staying within ±88° prevents the disorienting flip that occurs when
 * free rotation crosses the ±90° gimbal point.
 * Keyboard 90° steps are NOT clamped — they jump directly to valid snap targets.
 */
const RX_LIMIT = 88

// ─── Component ────────────────────────────────────────────────────────────────

export default function CubeNav({ onFaceSelect, size = 280 }: CubeNavProps) {
  const half = size / 2

  // ── Rotation state (drives active-face detection and status label) ───────────
  // During drag we bypass these via direct DOM writes to the cube inner element.
  const [rotX, setRotX] = useState(-15)
  const [rotY, setRotY] = useState(30)
  const [lang, setLang] = useState<Lang>('ro')

  // ── Refs: mutable values used inside RAF callbacks ───────────────────────────
  // rot mirrors state but is always up-to-date inside closures.
  const rot        = useRef({ x: -15, y: 30 })
  // Direct reference to the 3D inner element — written during drag to avoid
  // React re-renders on every pointer-move event.
  const cubeInnerRef = useRef<HTMLDivElement>(null)

  // Drag tracking (all refs — pointer movement must NOT cause re-renders)
  const dragging   = useRef(false)
  const dragOrigin = useRef({ mx: 0, my: 0, rx: 0, ry: 0 })
  const lastPos    = useRef({ x: 0, y: 0 })
  const vel        = useRef({ x: 0, y: 0 })
  const dragDist   = useRef(0)

  // RAF handles
  const rafInertia = useRef(0)
  const rafIdle    = useRef(0)
  const rafSnap    = useRef(0)
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Media preference
  const reducedMotion = useRef(false)

  // Active face is derived from rotation — computed synchronously in render.
  const activeFaceIdx = computeActiveFaceIdx(rotX, rotY)
  const activeFace    = FACES[activeFaceIdx]

  // ── Rotation update helpers ──────────────────────────────────────────────────

  /**
   * Write rotation directly to the DOM — no React state update.
   * Use ONLY during active drag to avoid triggering re-renders on every
   * pointer-move event (which can fire at >60 Hz on high-refresh monitors).
   */
  function applyRotationDirect(rx: number, ry: number) {
    rot.current.x = rx
    rot.current.y = ry
    if (cubeInnerRef.current) {
      cubeInnerRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
  }

  /**
   * Write rotation to the DOM AND to React state.
   * Use for all RAF-driven animations (inertia, idle, snap) where we need
   * the active-face indicator to stay in sync.
   */
  function applyRotation(rx: number, ry: number) {
    rot.current.x = rx
    rot.current.y = ry
    if (cubeInnerRef.current) {
      cubeInnerRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    setRotX(rx)
    setRotY(ry)
  }

  // ── prefers-reduced-motion ───────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const onChange = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // ── Language sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('noku_lang')
    if (saved === 'en' || saved === 'ro') setLang(saved)

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ lang?: Lang }>).detail
      if (detail?.lang === 'en' || detail?.lang === 'ro') setLang(detail.lang)
    }
    window.addEventListener('noku-lang-change', handler)
    return () => window.removeEventListener('noku-lang-change', handler)
  }, [])

  // ── Animation helpers ────────────────────────────────────────────────────────

  // Stable ref pointing to the "stop everything" function.
  const stopAllRef = useRef<() => void>(() => { /* filled below */ })

  stopAllRef.current = () => {
    cancelAnimationFrame(rafInertia.current)
    cancelAnimationFrame(rafIdle.current)
    cancelAnimationFrame(rafSnap.current)
    if (idleTimer.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = null
    }
  }

  // Stable ref pointing to startIdle (avoids circular useCallback deps)
  const startIdleRef = useRef<() => void>(() => { /* filled below */ })

  startIdleRef.current = () => {
    stopAllRef.current()
    if (reducedMotion.current) return

    idleTimer.current = setTimeout(() => {
      const tick = () => {
        // Slow, measured Y rotation — authority idle feel
        rot.current.y += 0.10
        setRotY(rot.current.y)
        rafIdle.current = requestAnimationFrame(tick)
      }
      rafIdle.current = requestAnimationFrame(tick)
    }, 3500)
  }

  // Mount/unmount lifecycle: start idle on mount, stop on unmount
  useEffect(() => {
    startIdleRef.current()
    return () => stopAllRef.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Inertia ──────────────────────────────────────────────────────────────────
  function startInertia() {
    stopAllRef.current()
    const tick = () => {
      vel.current.x *= 0.82
      vel.current.y *= 0.82

      if (Math.abs(vel.current.x) < 0.05 && Math.abs(vel.current.y) < 0.05) {
        startIdleRef.current()
        return
      }

      // Clamp X rotation; reflect velocity at boundary for natural damping
      const nextRx = rot.current.x + vel.current.x
      if (nextRx > RX_LIMIT) {
        rot.current.x = RX_LIMIT
        vel.current.x = 0
      } else if (nextRx < -RX_LIMIT) {
        rot.current.x = -RX_LIMIT
        vel.current.x = 0
      } else {
        rot.current.x = nextRx
      }
      rot.current.y += vel.current.y

      applyRotation(rot.current.x, rot.current.y)
      rafInertia.current = requestAnimationFrame(tick)
    }
    rafInertia.current = requestAnimationFrame(tick)
  }

  // ── Snap-to-face animation ────────────────────────────────────────────────────
  function snapToFace(faceIdx: number) {
    stopAllRef.current()

    const target = SNAP_TARGETS[faceIdx]
    const fromX  = rot.current.x
    const fromY  = rot.current.y
    const toX    = shortestAngle(fromX, target.rx)
    const toY    = shortestAngle(fromY, target.ry)

    if (reducedMotion.current) {
      applyRotation(toX, toY)
      startIdleRef.current()
      return
    }

    const DURATION = 550 // ms
    const t0 = performance.now()

    const tick = (now: number) => {
      const t     = Math.min((now - t0) / DURATION, 1)
      const eased = easeInOutCubic(t)
      applyRotation(fromX + (toX - fromX) * eased, fromY + (toY - fromY) * eased)

      if (t < 1) {
        rafSnap.current = requestAnimationFrame(tick)
      } else {
        startIdleRef.current()
      }
    }

    rafSnap.current = requestAnimationFrame(tick)
  }

  // ── Pointer drag ──────────────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent) {
    stopAllRef.current()
    dragging.current   = true
    dragDist.current   = 0
    dragOrigin.current = { mx: e.clientX, my: e.clientY, rx: rot.current.x, ry: rot.current.y }
    lastPos.current    = { x: e.clientX, y: e.clientY }
    vel.current        = { x: 0, y: 0 }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return

    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    dragDist.current += Math.hypot(dx, dy)
    vel.current = { x: dy * 0.30, y: dx * 0.30 }
    lastPos.current = { x: e.clientX, y: e.clientY }

    // Clamp X so free drag cannot cross the ±90° gimbal point.
    // Keyboard steps (90° jumps) bypass this clamp intentionally.
    const rx = Math.max(
      -RX_LIMIT,
      Math.min(RX_LIMIT, dragOrigin.current.rx + (e.clientY - dragOrigin.current.my) * 0.30)
    )
    const ry = dragOrigin.current.ry + (e.clientX - dragOrigin.current.mx) * 0.30

    // Direct DOM write — no React state update — keeps pointer move off the
    // React render path for full 60 fps without batching overhead.
    applyRotationDirect(rx, ry)
  }

  function onPointerUp() {
    if (!dragging.current) return
    dragging.current = false
    // One state sync so the active-face indicator updates immediately after drag.
    setRotX(rot.current.x)
    setRotY(rot.current.y)
    startInertia()
  }

  // ── Keyboard rotation ─────────────────────────────────────────────────────────
  function onKeyDown(e: React.KeyboardEvent) {
    const STEP = 90
    if (e.key === 'ArrowLeft')  { e.preventDefault(); stopAllRef.current(); applyRotation(rot.current.x, rot.current.y - STEP) }
    if (e.key === 'ArrowRight') { e.preventDefault(); stopAllRef.current(); applyRotation(rot.current.x, rot.current.y + STEP) }
    if (e.key === 'ArrowUp')    { e.preventDefault(); stopAllRef.current(); applyRotation(rot.current.x - STEP, rot.current.y) }
    if (e.key === 'ArrowDown')  { e.preventDefault(); stopAllRef.current(); applyRotation(rot.current.x + STEP, rot.current.y) }
    // Enter/Space handled on individual face buttons below
  }

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center" style={{ gap: '14px' }}>

      {/*
        Wrapper: position:relative so the ambient glow can be absolutely
        positioned behind the cube. The cube-float class adds the CSS idle
        float (translateY oscillation) — purely compositor-friendly.
      */}
      <div className="cube-float" style={{ position: 'relative', width: size, height: size }}>

        {/* ── Ambient glow — soft radial light behind the cube ──────────── */}
        <div className="cube-ambient" aria-hidden="true" />

        {/* ── Cube scene ────────────────────────────────────────────────── */}
        <div
          className="cube-scene"
          style={{
            position:    'relative',
            width:       size,
            height:      size,
            perspective: `${size * 3.2}px`,
            touchAction: 'none',
            userSelect:  'none',
            cursor:      'grab',
            outline:     'none',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          tabIndex={0}
          role="group"
          aria-label={
            lang === 'ro'
              ? 'Navigare 3D. Trageți sau folosiți săgețile pentru a roti cubul.'
              : '3D navigation cube. Drag or use arrow keys to rotate.'
          }
        >
          {/* Cube inner — establishes preserve-3d context.
              ref allows direct transform writes during drag (no React re-render). */}
          <div
            ref={cubeInnerRef}
            style={{
              width:          '100%',
              height:         '100%',
              position:       'relative',
              transformStyle: 'preserve-3d',
              transform:      `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            }}
          >
            {FACES.map((face, i) => {
              const slot     = FACE_SLOTS[i]
              const label    = lang === 'ro' ? face.ro : face.en
              const isActive = i === activeFaceIdx

              return (
                <div
                  key={face.id}
                  className={`cube-face${isActive ? ' cube-face--active' : ''}`}
                  style={{
                    position:                 'absolute',
                    inset:                    0,
                    transform:                slotTransform(slot, half),
                    backfaceVisibility:       'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isActive
                      ? `${label} — ${lang === 'ro' ? 'față activă, apasă pentru a selecta' : 'active face, press to select'}`
                      : label
                  }
                  aria-pressed={isActive}
                  onClick={() => {
                    if (dragDist.current < 6) {
                      snapToFace(i)
                      onFaceSelect?.(face.id)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      snapToFace(i)
                      onFaceSelect?.(face.id)
                    }
                  }}
                >
                  <div className="cube-face-content">
                    <span className="cube-face-tag">{face.tag}</span>
                    <span className="cube-face-label">{label}</span>
                    <span className="cube-face-accent" aria-hidden="true" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Active-face indicator ─────────────────────────────────────────── */}
      <div
        className="cube-status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={
          lang === 'ro'
            ? `Față activă: ${activeFace.ro}`
            : `Active face: ${activeFace.en}`
        }
      >
        <span className="cube-status-prefix" aria-hidden="true">
          {lang === 'ro' ? 'Activ' : 'Active'}
        </span>
        <span className="cube-status-dash" aria-hidden="true">─</span>
        <span className="cube-status-name" aria-hidden="true">
          {lang === 'ro' ? activeFace.ro : activeFace.en}
        </span>
      </div>

    </div>
  )
}
