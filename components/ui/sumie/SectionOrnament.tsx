/**
 * SectionOrnament
 *
 * Places a sumi-e motif into the margin of a section, the way a brush painting
 * carries a motif in one corner and leaves the rest as open paper.
 *
 * Exists so the theme reaches the WHOLE page rather than stopping at the hero.
 * Every ornament is decorative, non-interactive, and sits behind content.
 *
 * Sizing is viewport-relative and ornaments are hidden below `md` — on a phone
 * the content already fills the column, and a motif behind it just muddies the
 * text.
 */

'use client'

import { Bamboo, Crane, Enso, FujiSun, SakuraBranch, Torii } from './SumieArt'

type Motif = 'enso' | 'sakura' | 'bamboo' | 'torii' | 'fuji' | 'crane'
type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface SectionOrnamentProps {
  motif: Motif
  position?: Corner
  /** Tailwind size classes for the motif itself. */
  size?: string
  /** 0–100. Kept low: this is a watermark, not an illustration. */
  opacity?: number
  /** Gentle idle drift. Off for grounded motifs like the torii. */
  sway?: boolean
  /** Animate the ensō drawing itself. */
  draw?: boolean
}

const CORNERS: Record<Corner, string> = {
  'top-left': 'top-0 left-0 -translate-x-[18%] -translate-y-[12%]',
  'top-right': 'top-0 right-0 translate-x-[18%] -translate-y-[12%]',
  'bottom-left': 'bottom-0 left-0 -translate-x-[18%] translate-y-[12%]',
  'bottom-right': 'bottom-0 right-0 translate-x-[18%] translate-y-[12%]',
}

export function SectionOrnament({
  motif,
  position = 'top-right',
  size = 'w-64 lg:w-80',
  opacity = 9,
  sway = false,
  draw = false,
}: SectionOrnamentProps) {
  const motionClass = sway
    ? position.endsWith('right')
      ? 'animate-sway-slow'
      : 'animate-sway'
    : ''

  const common = `${size} ${motionClass} text-sumi`

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 hidden select-none md:block ${CORNERS[position]}`}
      style={{ opacity: opacity / 100 }}
    >
      {motif === 'enso' && <Enso className={common} draw={draw} />}
      {motif === 'sakura' && <SakuraBranch className={common} />}
      {motif === 'bamboo' && <Bamboo className={common} />}
      {motif === 'torii' && <Torii className={common} />}
      {motif === 'fuji' && <FujiSun className={common} />}
      {motif === 'crane' && <Crane className={common} />}
    </div>
  )
}
