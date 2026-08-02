'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/**
 * Assume reduced motion during SSR so the server never emits a frame of
 * animation the user asked not to see. The client corrects immediately after
 * hydration if motion is in fact allowed.
 */
function getServerSnapshot() {
  return true
}

/**
 * Tracks `prefers-reduced-motion` and re-renders when it changes.
 *
 * useSyncExternalStore rather than useState + useEffect: subscribing to an
 * external store is exactly what it is for, and it avoids the
 * react-hooks/set-state-in-effect violation the effect version produces.
 *
 * The CSS backstop in globals.css handles declarative animation. Use this hook
 * for JS-driven motion — canvas loops, the ink cursor, Framer Motion variants —
 * which CSS cannot reach.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
