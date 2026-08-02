/**
 * InkRipple
 * Drops a spreading blot of vermillion wherever the page is clicked, like ink
 * touching wet paper.
 *
 * Implemented as direct DOM appends rather than React state on purpose: a
 * click ripple is transient decoration, and routing it through state would
 * re-render the whole subtree on every click for something that is gone in
 * 600ms.
 *
 * Self-cleaning — each blot removes itself on animationend, with a timeout as a
 * backstop in case the animation never fires (a background tab, for instance),
 * so blots cannot accumulate in the DOM.
 */

'use client'

import { useEffect } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

const SIZE = 90

export function InkRipple() {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return

    const onPointerDown = (event: PointerEvent) => {
      // Ignore synthetic clicks with no real position (keyboard "click").
      if (event.clientX === 0 && event.clientY === 0) return

      const blot = document.createElement('span')
      blot.className = 'ink-blot'
      blot.style.width = `${SIZE}px`
      blot.style.height = `${SIZE}px`
      blot.style.left = `${event.clientX}px`
      blot.style.top = `${event.clientY}px`
      document.body.appendChild(blot)

      let done = false
      const remove = () => {
        if (done) return
        done = true
        blot.remove()
      }
      blot.addEventListener('animationend', remove, { once: true })
      window.setTimeout(remove, 1200)
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [prefersReducedMotion])

  return null
}
