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
