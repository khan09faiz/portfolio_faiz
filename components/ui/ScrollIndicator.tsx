/**
 * ScrollIndicator
 * Vermillion progress rule across the top of the page.
 *
 * The scroll listener is rAF-throttled and only touches React state when the
 * boolean actually flips. The previous version called setState on every scroll
 * event; React bails out on an unchanged value so it was not re-rendering, but
 * the handler still ran on every single event during a scroll.
 *
 * The bar itself is driven by Framer Motion's scrollYProgress straight onto
 * scaleX, so it animates on the compositor and never touches layout.
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollYProgress } = useScroll()
  const visibleRef = useRef(false)

  useEffect(() => {
    let ticking = false

    const update = () => {
      ticking = false
      const next = window.scrollY > 100
      if (next === visibleRef.current) return
      visibleRef.current = next
      setIsVisible(next)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-sumi/10">
      <motion.div
        className="h-full bg-crimson"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: '0%',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
