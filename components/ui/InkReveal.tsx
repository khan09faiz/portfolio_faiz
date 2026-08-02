/**
 * InkReveal
 * Section entrance in the sumi-e idiom: content wipes in from the bottom as
 * though ink were spreading up through washi paper.
 *
 * FAIL-SAFE BY DESIGN. An earlier version used Framer Motion's `whileInView`,
 * which server-renders the hidden state as inline styles. When a hydration
 * error stopped client JS, every section stayed at opacity 0 and the entire
 * page below the hero went blank. An animation must never be the thing that
 * makes content visible.
 *
 * So: the server renders content plainly visible. On mount, only elements that
 * are NOT already on screen get hidden and observed — which also avoids the
 * flash you would otherwise get on above-the-fold content. If JS never runs, if
 * hydration fails, or if IntersectionObserver is missing, the content is simply
 * there.
 *
 * Classes are driven straight off the ref rather than through React state, so
 * there is no re-render and no setState-in-effect.
 */

'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface InkRevealProps {
  children: ReactNode
  className?: string
}

export function InkReveal({ children, className }: InkRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    if (typeof IntersectionObserver === 'undefined') return

    const el = ref.current
    if (!el) return

    // Already on screen at mount: leave it alone. Hiding it now would produce a
    // visible flash of content disappearing and animating back in.
    const box = el.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) return

    el.classList.add('ink-reveal-hidden')

    const reveal = () => {
      el.classList.remove('ink-reveal-hidden')
      el.classList.add('ink-reveal-in')
      observer.disconnect()
      window.clearTimeout(failsafe)

      /*
        Strip the animation class once it finishes.

        `ink-reveal-in` animates transform and clip-path, and with
        animation-fill-mode: forwards BOTH stay applied forever. Each of them
        makes this element a containing block for `position: fixed`
        descendants, which broke every modal rendered inside a section —
        `fixed inset-0` sized itself to the section instead of the viewport and
        then got clipped by the section's overflow.

        Once the reveal has played there is nothing to keep, so it is removed
        and the element goes back to being an ordinary, side-effect-free box.
      */
      el.addEventListener(
        'animationend',
        () => el.classList.remove('ink-reveal-in'),
        { once: true }
      )
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal()
        }
      },
      { rootMargin: '0px 0px -60px 0px' }
    )

    /*
      Hard guarantee. The observer is what makes the reveal feel good, but it is
      NOT allowed to be what decides whether content is readable. If it never
      fires — a browser quirk, a detached scroll container, an environment that
      does not composite — this reveals everything anyway. Content is visible
      within 2.5s no matter what happens.
    */
    const failsafe = window.setTimeout(reveal, 2500)

    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [prefersReducedMotion])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
