/**
 * SwordSlash
 * A katana streak that sweeps across its container once, leaving a fading
 * crimson afterglow.
 *
 * DESIGN NOTE — this is an accent, not a blocking loader.
 * docs/UI_DESIGN.md asks for a "sword slash loader". A true loader means an
 * opaque veil over the page until the slash finishes, and that veil sits in
 * front of the hero for the whole animation, pushing Largest Contentful Paint
 * out by roughly its duration — on a site whose own docs demand performance and
 * SEO. It also risks stranding the user behind an overlay if the JS errors.
 *
 * So the slash plays OVER content that is already painted: same cinematic beat,
 * zero LCP cost, and nothing can trap the viewer. If a full blocking loader is
 * genuinely wanted, it is a small change from here — say so.
 *
 * Pure CSS animation, so it completes even if hydration is slow, and the global
 * reduced-motion backstop collapses it to nothing.
 */

'use client'

import { useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface SwordSlashProps {
  /** Milliseconds to wait before the blade travels. */
  delay?: number
  className?: string
}

export function SwordSlash({ delay = 250, className = '' }: SwordSlashProps) {
  const prefersReducedMotion = useReducedMotion()
  const [spent, setSpent] = useState(false)

  if (prefersReducedMotion || spent) return null

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* The blade: a thin bright streak that scales across, then vanishes. */}
      <div
        className="absolute left-[-10%] top-1/2 h-[2px] w-[120%] origin-left"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(var(--moonlight) / 0.9) 35%, rgb(var(--crimson)) 55%, transparent)',
          filter: 'drop-shadow(0 0 6px rgb(var(--crimson) / 0.8))',
          animation: `slash 700ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms forwards`,
          transform: 'scaleX(0) rotate(-18deg)',
          opacity: 0,
        }}
        onAnimationEnd={() => setSpent(true)}
      />
    </div>
  )
}
