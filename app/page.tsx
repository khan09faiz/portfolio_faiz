'use client'

import { Hero } from '@/components/features/hero/Hero'
import { ProjectsSection } from '@/components/features/projects'
import { SkillsSection } from '@/components/features/skills'
import { TimelineSection } from '@/components/features/timeline'
import { GitHubSection } from '@/components/features/github'
import { ContactSection } from '@/components/features/contact'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { InkReveal } from '@/components/ui/InkReveal'
import { SectionOrnament } from '@/components/ui/sumie/SectionOrnament'
import type { ReactNode } from 'react'

/**
 * Each section gets its own sumi-e motif in the margin, so the theme carries
 * the whole way down the page instead of stopping below the hero. `relative`
 * + `overflow-hidden` keeps an ornament clipped to its own section rather than
 * bleeding into the neighbouring one.
 */
function Section({ children, ornament }: { children: ReactNode; ornament: ReactNode }) {
  return (
    <InkReveal>
      <div className="relative overflow-hidden">
        {ornament}
        <div className="relative z-10">{children}</div>
      </div>
    </InkReveal>
  )
}

export default function Home() {
  return (
    <>
      <ScrollIndicator />
      <main className="min-h-screen pt-16 relative overflow-hidden">
        <Hero />

        <Section
          ornament={<SectionOrnament motif="bamboo" position="top-left" size="w-24 lg:w-32" opacity={10} sway />}
        >
          <ProjectsSection />
        </Section>

        <Section
          ornament={
            <SectionOrnament motif="enso" position="top-right" size="w-72 lg:w-96" opacity={7} draw />
          }
        >
          <SkillsSection />
        </Section>

        <Section
          ornament={
            <SectionOrnament motif="sakura" position="top-right" size="w-72 lg:w-[26rem]" opacity={12} sway />
          }
        >
          <TimelineSection />
        </Section>

        <Section
          ornament={<SectionOrnament motif="torii" position="bottom-left" size="w-56 lg:w-72" opacity={8} />}
        >
          <GitHubSection />
        </Section>

        <Section
          ornament={<SectionOrnament motif="crane" position="top-right" size="w-56 lg:w-72" opacity={10} sway />}
        >
          <ContactSection />
        </Section>
      </main>
    </>
  )
}
