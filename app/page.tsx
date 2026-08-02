/**
 * Home page — a SERVER component.
 *
 * This was `'use client'`, which meant the whole tree below it was client-side
 * and every section reached into lib/content itself at module scope. Content is
 * now fetched here, on the server, and passed down as props.
 *
 * Why that matters beyond tidiness: when the JSON backing store is replaced by
 * a database or CMS, the query runs on the server with its credentials, and the
 * client only ever receives the resulting data. Sections stay client components
 * because they all need interactivity — filters, modals, observers — but they
 * are now presentational with respect to content.
 */

import { Hero } from '@/components/features/hero/Hero'
import { ProjectsSection } from '@/components/features/projects'
import { SkillsSection } from '@/components/features/skills'
import { TimelineSection } from '@/components/features/timeline'
import { GitHubSection } from '@/components/features/github'
import { ContactSection } from '@/components/features/contact'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'
import { InkReveal } from '@/components/ui/InkReveal'
import { SectionOrnament } from '@/components/ui/sumie/SectionOrnament'
import { getHomeContent } from '@/lib/content'
import type { ReactNode } from 'react'

/**
 * Each section gets its own sumi-e motif in the margin so the theme carries the
 * whole way down the page. `relative` + `overflow-hidden` keeps an ornament
 * clipped to its own section rather than bleeding into the neighbouring one.
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

export default async function Home() {
  const { projects, skills, timeline } = await getHomeContent()

  return (
    <>
      <ScrollIndicator />
      <main className="min-h-screen pt-16 relative overflow-hidden">
        <Hero />

        <Section
          ornament={
            <SectionOrnament motif="bamboo" position="top-left" size="w-24 lg:w-32" opacity={10} sway />
          }
        >
          <ProjectsSection projects={projects} />
        </Section>

        <Section
          ornament={
            <SectionOrnament motif="enso" position="top-right" size="w-72 lg:w-96" opacity={7} draw />
          }
        >
          <SkillsSection skills={skills} />
        </Section>

        <Section
          ornament={
            <SectionOrnament motif="sakura" position="top-right" size="w-72 lg:w-[26rem]" opacity={12} sway />
          }
        >
          <TimelineSection timeline={timeline} />
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
