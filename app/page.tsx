'use client'

import { Hero } from '@/components/features/hero/Hero'
import { ProjectsSection } from '@/components/features/projects'
import { SkillsSection } from '@/components/features/skills'
import { TimelineSection } from '@/components/features/timeline'
import { GitHubSection } from '@/components/features/github'
import { ContactSection } from '@/components/features/contact'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { InkReveal } from '@/components/ui/InkReveal'

export default function Home() {
  return (
    <>
      <ScrollIndicator />
      <main className="min-h-screen pt-16 relative overflow-hidden">
        {/* Ink pooling behind the content. Sits above the canvas atmosphere but
            below everything readable. */}
        <div className="fixed inset-0 pointer-events-none opacity-40">
          <div className="absolute top-20 right-20 w-96 h-96 bg-crimson/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-gold/[0.06] rounded-full blur-3xl" />
        </div>

        <Hero />

        <InkReveal>
          <ProjectsSection />
        </InkReveal>

        <InkReveal>
          <SkillsSection />
        </InkReveal>

        <InkReveal>
          <TimelineSection />
        </InkReveal>

        <InkReveal>
          <GitHubSection />
        </InkReveal>

        <InkReveal>
          <ContactSection />
        </InkReveal>
      </main>
    </>
  )
}
