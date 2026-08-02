/**
 * SectionHeader
 * Section title painted into a vermillion brush band, after the red banner on
 * the reference sheet, with a hanko seal carrying the path label.
 *
 * Deliberately NOT animated with Framer Motion. The previous version used
 * `whileInView` with `once: false`, which server-renders opacity 0 and animates
 * back out every time the header leaves the viewport — putting section titles
 * behind JS for their basic visibility. That is the same failure mode that
 * blanked the page when hydration broke. Everything here is present in the
 * server HTML.
 */

'use client'

import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  terminalPath: string
  title: string
  description?: string | React.ReactNode
  className?: string
  /** Retained for API compatibility with existing call sites. */
  isInView?: boolean
}

export function SectionHeader({
  terminalPath,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('text-center mb-10 sm:mb-14', className)}>
      {/* Hanko seal with the path label */}
      <div className="mb-5 flex items-center justify-center gap-2.5">
        <span className="hanko-seal h-6 w-6 font-mono text-[11px] font-bold leading-none">
          印
        </span>
        <code className="font-mono text-xs tracking-wide text-muted sm:text-sm">
          {terminalPath}
        </code>
      </div>

      {/* Title, knocked out of a painted band */}
      <h2 className="mb-5 text-3xl font-bold sm:text-4xl lg:text-5xl">
        <span className="brush-band">{title}</span>
      </h2>

      {/* Brush rule beneath */}
      <div className="brush-rule mx-auto mb-5 w-28" />

      {description && (
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
