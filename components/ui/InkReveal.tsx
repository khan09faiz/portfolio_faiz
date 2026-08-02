/**
 * InkReveal
 * Section entrance in the sumi-e idiom: the content wipes in from the bottom
 * as though ink were spreading up through washi paper.
 *
 * Deliberately animates only opacity, transform and clip-path — all compositor
 * friendly. An earlier draft animated `filter: blur()` too, which looked better
 * but is a per-frame raster cost on large subtrees and blew the motion budget.
 */

'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface InkRevealProps {
  children: ReactNode
  className?: string
  /** Seconds to wait before the wipe begins. */
  delay?: number
  /** Wipe direction. 'up' is the default ink-spreading feel. */
  from?: 'up' | 'left'
}

export function InkReveal({ children, className, delay = 0, from = 'up' }: InkRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  // No motion: render the content plainly. Not a fade — a reduced-motion user
  // asked for no animation, and a 0ms fade is still a flash.
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const hidden =
    from === 'up'
      ? { opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' }
      : { opacity: 0, x: -24, clipPath: 'inset(0% 100% 0% 0%)' }

  const visible =
    from === 'up'
      ? { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }
      : { opacity: 1, x: 0, clipPath: 'inset(0% 0% 0% 0%)' }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
