import { Hero } from '@/components/features/hero/Hero'
import { ProjectsSection } from '@/components/features/projects'
import { SkillsSection } from '@/components/features/skills'
import { CertificatesSection } from '@/components/features/certificates'
import { TimelineSection } from '@/components/features/timeline'
import { GitHubSection } from '@/components/features/github'
import { ContactSection } from '@/components/features/contact'
import { ScrollIndicator } from '@/components/ui/ScrollIndicator'

export default function Home() {
  return (
    <>
      <ScrollIndicator />
      <main className="min-h-screen pt-16">
        <Hero />
        <ProjectsSection />
        <SkillsSection />
        <CertificatesSection />
        <TimelineSection />
        <GitHubSection />
        <ContactSection />
      </main>
    </>
  )
}
