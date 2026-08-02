/**
 * Sumi-e motif library
 *
 * Original brush-style artwork in the traditional sumi-e vocabulary — ensō,
 * sakura, bamboo, torii, Fuji under a rising sun. The motifs are traditional;
 * every path here is authored for this project.
 *
 * The dry-brush edge comes from an feTurbulence displacement filter applied over
 * clean geometry, rather than from hand-drawn ragged outlines. That keeps the
 * paths short and editable while still reading as a loaded brush on absorbent
 * paper.
 *
 * Filter ids are per-instance via useId — a hard-coded id collides as soon as
 * two motifs render on the same page, and the second one silently adopts the
 * first one's filter.
 *
 * All motifs paint with theme tokens, so they follow the vermillion intensity
 * switch. All are decorative and aria-hidden.
 */

'use client'

import { useId } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

interface MotifProps {
  className?: string
  /** Roughness of the brush edge. 0 disables the filter entirely. */
  roughness?: number
  /** Animate the stroke drawing itself on scroll-in. */
  draw?: boolean
}

function BrushFilter({ id, scale }: { id: string; scale: number }) {
  if (scale <= 0) return null
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="7" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  )
}

/* ------------------------------------------------------------------ Ensō */

export function Enso({ className = '', roughness = 5, draw = false }: MotifProps) {
  const uid = useId().replace(/:/g, '')
  const filterId = `enso-${uid}`
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
            of a real brush — a single stroke cannot vary its width. */}
        <path
          d="M 100 18 A 82 82 0 1 1 44 42"
          strokeWidth="15"
          opacity="0.92"
          className={animate ? 'sumi-draw' : undefined}
          style={animate ? { strokeDasharray: 460, strokeDashoffset: 460 } : undefined}
        />
        <path d="M 128 24 A 82 82 0 0 1 178 88" strokeWidth="20" opacity="0.85" />
        <path d="M 60 168 A 82 82 0 0 0 150 152" strokeWidth="9" opacity="0.6" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------- Sakura branch */

export function SakuraBranch({ className = '', roughness = 4 }: MotifProps) {
  const uid = useId().replace(/:/g, '')
  const filterId = `sakura-${uid}`

  // Blossom positions along the branch.
  const blossoms: Array<[number, number, number]> = [
    [58, 62, 1], [96, 44, 0.82], [132, 66, 1.05],
    [168, 40, 0.76], [120, 96, 0.7], [196, 74, 0.9], [82, 104, 0.62],
  ]

  return (
    <svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined}>
        {/* Branch — filled rather than stroked so it can taper from base to tip. */}
        <path
          d="M 4 126 C 40 118 62 104 84 86 C 104 70 128 58 158 50 C 182 44 206 42 232 44
             L 232 52 C 208 50 184 52 162 58 C 132 66 110 78 92 94 C 70 112 44 126 8 134 Z"
          fill="currentColor"
        />
        {/* Twigs */}
        <path d="M 86 88 C 92 74 96 62 94 48 L 99 47 C 102 62 98 76 91 90 Z" fill="currentColor" />
        <path d="M 138 62 C 142 78 138 90 126 100 L 122 96 C 133 87 137 77 133 63 Z" fill="currentColor" />
        <path d="M 176 48 C 182 40 188 36 198 34 L 199 39 C 190 41 184 45 180 51 Z" fill="currentColor" />
      </g>

      {/* Blossoms — vermillion, five petals around a pale centre */}
      <g>
        {blossoms.map(([cx, cy, s], i) => (
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

export function Bamboo({ className = '', roughness = 4 }: MotifProps) {
  const uid = useId().replace(/:/g, '')
  const filterId = `bamboo-${uid}`

  return (
    <svg viewBox="0 0 120 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        {/* Two stalks. Segments are long with a narrow node gap and barely any
            corner rounding — an earlier pass used short pill-shaped segments
            with wide gaps and read as a dashed line, not bamboo. */}
        {[
          { x: 26, w: 21, o: 0.9 },
          { x: 72, w: 15, o: 0.6 },
        ].map((stalk, si) =>
          [0, 1, 2, 3, 4].map((seg) => {
            const top = 4 + seg * 53 + si * 7
            return (
              <g key={`${si}-${seg}`} opacity={stalk.o}>
                <rect x={stalk.x} y={top} width={stalk.w} height={47} rx={3} />
                {/* node collar */}
                <rect x={stalk.x - 2} y={top + 47} width={stalk.w + 4} height={4} rx={1.5} />
              </g>
            )
          })
        )}
        {/* Lance-shaped leaves */}
        <path d="M 47 66 C 70 52 92 48 116 52 C 96 68 72 76 48 74 Z" opacity="0.88" />
        <path d="M 26 122 C 8 112 2 96 2 78 C 16 92 24 106 30 124 Z" opacity="0.72" />
        <path d="M 87 168 C 106 158 116 144 119 126 C 104 142 94 154 86 170 Z" opacity="0.66" />
        <path d="M 47 196 C 68 188 86 190 104 198 C 84 204 64 204 46 200 Z" opacity="0.58" />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------- Torii */

export function Torii({ className = '', roughness = 4 }: MotifProps) {
  const uid = useId().replace(/:/g, '')
  const filterId = `torii-${uid}`

  return (
    <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        {/* Kasagi — the curved top lintel */}
        <path d="M 8 34 C 62 20 138 20 192 34 L 192 46 C 138 33 62 33 8 46 Z" />
        {/* Nuki — the straight second beam */}
        <rect x="26" y="62" width="148" height="11" />
        {/* Posts, tapering outward toward the base */}
        <path d="M 46 30 L 62 30 L 68 168 L 40 168 Z" />
        <path d="M 138 30 L 154 30 L 160 168 L 132 168 Z" />
        {/* Gakuzuka — the small centre strut */}
        <rect x="95" y="40" width="10" height="24" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------- Fuji + sun */

export function FujiSun({ className = '', roughness = 4 }: MotifProps) {
  const uid = useId().replace(/:/g, '')
  const filterId = `fuji-${uid}`

  return (
    <svg viewBox="0 0 220 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <circle cx="110" cy="74" r="52" fill="rgb(var(--vermillion))" opacity="0.9" />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        {/* Mountain, with the snow line left as a notch in the ridge */}
        <path
          d="M 14 140 C 48 116 72 92 96 68 C 100 64 106 62 110 62 C 116 62 120 65 124 70
             C 148 96 172 118 206 140 C 168 132 130 128 110 128 C 90 128 52 132 14 140 Z"
        />
        <path
          d="M 96 74 C 102 80 108 82 112 80 C 116 78 120 74 124 76 L 118 68 C 114 63 106 63 102 68 Z"
          fill="rgb(var(--paper))"
          opacity="0.9"
        />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------- Crane */

export function Crane({ className = '', roughness = 3 }: MotifProps) {
  const uid = useId().replace(/:/g, '')
  const filterId = `crane-${uid}`

  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <BrushFilter id={filterId} scale={roughness} />
      <g filter={roughness > 0 ? `url(#${filterId})` : undefined} fill="currentColor">
        {/* Body — elongated and tapering into a tail plume at the right. The
            first pass was a plain oval and read as a blob. */}
        <path
          d="M 64 104 C 78 86 108 80 132 88 C 152 95 166 106 182 116
             C 164 116 152 120 142 128 C 120 140 88 138 72 126 C 63 119 60 111 64 104 Z"
        />
        {/* Tail plume */}
        <path d="M 158 112 C 172 108 184 104 196 96 C 190 110 178 120 164 124 Z" opacity="0.75" />
        {/* Wing, sitting slightly proud of the body */}
        <path
          d="M 86 102 C 106 92 128 94 148 106 C 128 105 106 108 90 114 Z"
          fill="rgb(var(--paper))"
          opacity="0.45"
        />
        {/* Neck — a proper S rather than a straight post */}
        <path d="M 68 104 C 58 86 55 64 62 48 C 65 41 71 38 76 42 C 68 56 64 78 74 100 Z" />
        {/* Head */}
        <path d="M 62 50 C 56 43 57 34 64 31 C 71 29 77 34 77 41 C 77 48 69 52 63 50 Z" />
        {/*
          Beak points AWAY from the body. In the first pass it pointed right,
          back across the bird, which is what made it read as an ostrich.
        */}
        <path d="M 60 37 L 36 32 L 60 44 Z" />
        {/* Legs */}
        <path d="M 104 136 L 108 180 L 102 180 L 96 136 Z" />
        <path d="M 126 134 L 138 176 L 132 178 L 118 136 Z" />
        <path d="M 108 180 L 128 186 L 106 186 Z" />
      </g>
    </svg>
  )
}
