/**
 * SamuraiCrest
 * Original artwork — a kabuto (samurai helmet) silhouette in sumi ink, set on a
 * hinomaru sun disc inside an ensō brush ring.
 *
 * Drawn as inline SVG rather than shipped as a raster so it stays crisp at any
 * size, adds no network request, and — because it paints with the theme tokens —
 * follows the vermillion intensity switch automatically.
 *
 * Purely decorative: aria-hidden, and it carries no information that is not
 * already in the surrounding copy.
 */

interface SamuraiCrestProps {
  className?: string
  /** Overall opacity. Low values read as a watermark behind content. */
  opacity?: number
  /** Draw the hinomaru disc behind the helmet. */
  showSun?: boolean
  /** Draw the ensō ring around it. */
  showEnso?: boolean
}

export function SamuraiCrest({
  className = '',
  opacity = 1,
  showSun = true,
  showEnso = true,
}: SamuraiCrestProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ opacity }}
    >
      {/* Hinomaru — the sun disc */}
      {showSun && (
        <circle cx="120" cy="116" r="80" fill="rgb(var(--vermillion))" opacity="0.9" />
      )}

      {/*
        Ensō — a single brush circle, left deliberately open. Two overlapping
        strokes of different weight and length fake the pressure taper a real
        brush leaves, which a uniform stroke cannot.
      */}
      {showEnso && (
        <g
          fill="none"
          stroke="rgb(var(--sumi))"
          strokeLinecap="round"
          transform="rotate(-28 120 116)"
        >
          <path
            d="M 120 20 A 96 96 0 1 1 60 41"
            strokeWidth="9"
            opacity="0.85"
          />
          <path
            d="M 150 27 A 96 96 0 0 1 205 95"
            strokeWidth="13"
            opacity="0.7"
          />
        </g>
      )}

      {/* Kabuto */}
      <g fill="rgb(var(--sumi))">
        {/* Maedate — the crescent crest */}
        <path d="M 86 70 A 34 34 0 0 1 154 70 A 44 44 0 0 0 86 70 Z" />

        {/* Hachi — the dome */}
        <path d="M 72 132 C 72 86 92 62 120 62 C 148 62 168 86 168 132 Z" />

        {/* Fukigaeshi — the swept side flares */}
        <path d="M 70 128 L 44 117 L 41 148 L 68 152 Z" />
        <path d="M 170 128 L 196 117 L 199 148 L 172 152 Z" />

        {/* Shikoro — layered neck guard */}
        <path d="M 68 132 L 172 132 L 181 151 Q 120 163 59 151 Z" />
        <path
          d="M 62 154 L 178 154 L 186 172 Q 120 184 54 172 Z"
          opacity="0.88"
        />

        {/* Mempo — a suggestion of the face mask */}
        <path
          d="M 97 150 Q 120 165 143 150 L 139 170 Q 120 180 101 170 Z"
          fill="rgb(var(--paper))"
          opacity="0.22"
        />
      </g>
    </svg>
  )
}
