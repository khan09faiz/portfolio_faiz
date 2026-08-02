/**
 * Sumi-e motif library
 *
 * Original brush artwork in the traditional sumi-e vocabulary — ensō, sakura,
 * bamboo, torii, Fuji under a rising sun, crane, and a standing samurai.
 * The motifs are traditional; every path is authored for this project.
 *
 * Dry-brush edges come from an feTurbulence displacement filter over clean
 * geometry rather than hand-drawn ragged outlines.
 *
 * Path data lives in ./paths.ts as single-line constants — see the note there.
 * Inlining multi-line `d` attributes breaks hydration.
 *
 * Filter ids are per-instance via useId; a fixed id collides the moment two
 * motifs share a page and the second silently adopts the first one's filter.
 */

'use client'

import { useId } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { BAMBOO, CRANE, ENSO, FUJI, SAKURA, SAMURAI, TORII } from './paths'

interface MotifProps {
  className?: string
  /** Roughness of the brush edge. 0 disables the filter entirely. */
  roughness?: number
  /** Animate the stroke drawing itself in. */
  draw?: boolean
}

function BrushFilter({ id, scale }: { id: string; scale: number }) {
  if (scale <= 0) return null
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="n"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  )
}

function useFilterId(prefix: string) {
  return `${prefix}-${useId().replace(/:/g, '')}`
}

/* ------------------------------------------------------------------ Ensō */

export function Enso({ className = '', roughness = 5, draw = false }: MotifProps) {
  const filterId = useFilterId('enso')
  const prefersReducedMotion = useReducedMotion()
  const animate = draw && !prefersReducedMotion

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g
        filter={roughness > 0 ? `url(#${filterId})` : undefined}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      >
        {/* Three overlapping arcs of decreasing weight fake the pressure taper
            of a real brush — one stroke cannot vary its own width. */}
        <path
          d={ENSO.main}
          strokeWidth="15"
          opacity="0.92"
          className={animate ? 'sumi-draw' : undefined}
          style={animate ? { strokeDasharray: 460 } : undefined}
        />
        <path d={ENSO.weight} strokeWidth="20" opacity="0.85" />
        <path d={ENSO.tail} strokeWidth="9" opacity="0.6" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------- Sakura branch */

const BLOSSOMS: Array<[number, number, number]> = [
  [58, 62, 1], [96, 44, 0.82], [132, 66, 1.05],
  [168, 40, 0.76], [120, 96, 0.7], [196, 74, 0.9], [82, 104, 0.62],
]

export function SakuraBranch({ className = '', roughness = 4 }: MotifProps) {
  const filterId = useFilterId('sakura')

  return (
    <svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        {/* Filled rather than stroked so the branch tapers from base to tip. */}
        <path d={SAKURA.branch} />
        <path d={SAKURA.twig1} />
        <path d={SAKURA.twig2} />
        <path d={SAKURA.twig3} />
      </g>
      <g>
        {BLOSSOMS.map(([cx, cy, s], i) => (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${s}) rotate(${i * 26})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx="0"
                cy="-6.5"
                rx="4.2"
                ry="6.2"
                fill="rgb(var(--vermillion))"
                transform={`rotate(${a})`}
                opacity="0.92"
              />
            ))}
            <circle r="2.1" fill="rgb(var(--paper))" opacity="0.85" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- Bamboo */

const STALKS = [
  { x: 26, w: 21, o: 0.9 },
  { x: 72, w: 15, o: 0.6 },
]

export function Bamboo({ className = '', roughness = 4 }: MotifProps) {
  const filterId = useFilterId('bamboo')

  return (
    <svg viewBox="0 0 120 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        {/* Long segments with a narrow node collar. Short pill segments with
            wide gaps read as a dashed line, not bamboo. */}
        {STALKS.map((stalk, si) =>
          [0, 1, 2, 3, 4].map((seg) => {
            const top = 4 + seg * 53 + si * 7
            return (
              <g key={`${si}-${seg}`} opacity={stalk.o}>
                <rect x={stalk.x} y={top} width={stalk.w} height={47} rx={3} />
                <rect x={stalk.x - 2} y={top + 47} width={stalk.w + 4} height={4} rx={1.5} />
              </g>
            )
          })
        )}
        <path d={BAMBOO.leaf1} opacity="0.88" />
        <path d={BAMBOO.leaf2} opacity="0.72" />
        <path d={BAMBOO.leaf3} opacity="0.66" />
        <path d={BAMBOO.leaf4} opacity="0.58" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------- Torii */

export function Torii({ className = '', roughness = 4 }: MotifProps) {
  const filterId = useFilterId('torii')

  return (
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        <path d={TORII.kasagi} />
        <rect x="26" y="62" width="148" height="11" />
        <path d={TORII.postL} />
        <path d={TORII.postR} />
        <rect x="95" y="40" width="10" height="24" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------- Fuji + sun */

export function FujiSun({ className = '', roughness = 4 }: MotifProps) {
  const filterId = useFilterId('fuji')

  return (
    <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <circle cx="110" cy="74" r="52" fill="rgb(var(--vermillion))" opacity="0.9" />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        <path d={FUJI.mountain} />
        <path d={FUJI.snow} fill="rgb(var(--paper))" opacity="0.9" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------- Crane */

export function Crane({ className = '', roughness = 3 }: MotifProps) {
  const filterId = useFilterId('crane')

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        <path d={CRANE.body} />
        <path d={CRANE.tail} opacity="0.75" />
        <path d={CRANE.wing} fill="rgb(var(--paper))" opacity="0.45" />
        <path d={CRANE.neck} />
        <path d={CRANE.head} />
        {/* Beak points away from the body — pointing it back across the bird
            is what made an earlier pass read as an ostrich. */}
        <path d={CRANE.beak} />
        <path d={CRANE.legL} />
        <path d={CRANE.legR} />
        <path d={CRANE.foot} />
      </g>
    </svg>
  )
}

/* -------------------------------------------------- Samurai against the sun */

interface SamuraiProps extends MotifProps {
  /** Draw the hinomaru disc behind the figure. */
  showSun?: boolean
}

export function Samurai({ className = '', roughness = 4, showSun = true }: SamuraiProps) {
  const filterId = useFilterId('samurai')

  return (
    <svg viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />

      {/* Hinomaru — the rising sun the figure stands against */}
      {showSun && <circle cx="140" cy="132" r="112" fill="rgb(var(--vermillion))" opacity="0.92" />}

      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        {/* Sheathed katana, drawn first so the body overlaps it */}
        <path d={SAMURAI.bladeSheath} opacity="0.95" />
        <path d={SAMURAI.hilt} opacity="0.95" />

        <path d={SAMURAI.topknot} />
        <path d={SAMURAI.head} />
        <path d={SAMURAI.neck} />
        <path d={SAMURAI.armL} />
        <path d={SAMURAI.armR} />
        {/* Kataginu — the stiff winged shoulders that make the silhouette read
            as a samurai rather than any robed figure */}
        <path d={SAMURAI.shoulders} />
        <path d={SAMURAI.torso} />
        <path d={SAMURAI.sash} />
        <path d={SAMURAI.hakamaL} />
        <path d={SAMURAI.hakamaR} />
        <path d={SAMURAI.footL} />
        <path d={SAMURAI.footR} />
      </g>
    </svg>
  )
}
