/**
 * SkillsSection
 * 3D interactive globe showcasing technical skills.
 *
 * PERFORMANCE — the globe pulls in three, @react-three/fiber and drei, which
 * together were the largest single item in the initial JS payload and were
 * downloaded on every visit whether or not the visitor ever scrolled this far.
 *
 * It is now split into its own chunk (ssr:false — it needs WebGL and cannot be
 * server-rendered anyway) AND only mounted once the section is actually near
 * the viewport, so the download is deferred rather than merely moved off the
 * critical path.
 *
 * The placeholder reserves the same height, so deferring it costs no layout
 * shift.
 */

'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { SkillCategory } from '@/lib/types'

const SkillsGlobe = dynamic(
  () => import('./SkillsGlobe').then((m) => ({ default: m.SkillsGlobe })),
  {
    ssr: false,
    loading: () => <GlobePlaceholder />,
  }
)

function GlobePlaceholder() {
  return (
    <div className="flex h-[460px] w-full items-center justify-center rounded-xl border border-accent/30 bg-card sm:h-[520px]">
      {/* Neutral copy — this panel is also the resting state if WebGL or the
          globe chunk never arrives, so it must not promise a load. */}
      <span className="font-mono text-sm text-muted">墨 · skills globe</span>
    </div>
  )
}

interface SkillsSectionProps {
  /** Fetched on the server in app/page.tsx. */
  skills: SkillCategory[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const holderRef = useRef<HTMLDivElement>(null)
  const [shouldMount, setShouldMount] = useState(false)

  useEffect(() => {
    const el = holderRef.current
    if (!el) return

    // No IntersectionObserver: mount anyway rather than never. Deferred to a
    // task so this is not a synchronous setState inside the effect body.
    if (typeof IntersectionObserver === 'undefined') {
      const t = window.setTimeout(() => setShouldMount(true), 0)
      return () => window.clearTimeout(t)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setShouldMount(true)
          observer.disconnect()
        }
      },
      // Start fetching a little before it is reached so the globe is ready by
      // the time it scrolls into view.
      { rootMargin: '400px 0px' }
    )

    /*
      Note the deliberate absence of a timed failsafe here, unlike InkReveal.
      There, a failsafe guarantees TEXT becomes readable — non-negotiable. Here
      it would download ~330KB of WebGL libraries for every visitor who never
      scrolls this far, which defeats the whole point of deferring it. The
      feature-detection branch above covers the only realistic way the observer
      is unavailable, and the fallback if it somehow never fires is a static
      panel rather than missing content.
    */
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <SectionHeader terminalPath="~/skills" title="Technical Skills" />

        <div
          ref={holderRef}
          className="mt-8 sm:mt-10 md:mt-12"
          style={{ touchAction: 'pan-y' }}
        >
          {shouldMount ? <SkillsGlobe skillsData={skills} /> : <GlobePlaceholder />}
        </div>
      </div>
    </section>
  )
}
