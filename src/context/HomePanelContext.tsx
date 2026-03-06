'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import type { CubeFace } from '@/components/interactive/CubeNav'

// ─── Types ────────────────────────────────────────────────────────────────────

type HomePanelContextValue = {
  /** The currently visible section, or null when the panel is closed. */
  activeFace: CubeFace | null
  /** Open a specific face. Pass null to close. */
  setActiveFace: (face: CubeFace | null) => void
  /**
   * Toggle a face: opens it if closed or different, closes it if already active.
   * This is the primary handler for both cube clicks and footer nav clicks.
   */
  toggleFace: (face: CubeFace) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const HomePanelContext = createContext<HomePanelContextValue>({
  activeFace: null,
  setActiveFace: () => {},
  toggleFace: () => {},
})

// ─── Provider ─────────────────────────────────────────────────────────────────

export function HomePanelProvider({ children }: { children: React.ReactNode }) {
  const [activeFace, setActiveFaceState] = useState<CubeFace | null>(null)

  const setActiveFace = useCallback((face: CubeFace | null) => {
    setActiveFaceState(face)
  }, [])

  const toggleFace = useCallback((face: CubeFace) => {
    setActiveFaceState(prev => (prev === face ? null : face))
  }, [])

  return (
    <HomePanelContext.Provider value={{ activeFace, setActiveFace, toggleFace }}>
      {children}
    </HomePanelContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHomePanel() {
  return useContext(HomePanelContext)
}
