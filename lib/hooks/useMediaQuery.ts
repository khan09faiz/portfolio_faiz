'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribes to a CSS media query.
 *
 * @param query           e.g. '(pointer: fine)'
 * @param serverSnapshot  value assumed during SSR. Pick the conservative one —
 *                        whichever renders less, so the server never emits
 *                        markup the client immediately tears down.
 */
export function useMediaQuery(query: string, serverSnapshot = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query]
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
