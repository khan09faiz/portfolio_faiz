/**
 * SkillsSection Component
 * 3D Interactive Globe showcasing technical skills
 */

'use client'

import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SkillCategory } from '@/lib/types'
import { SkillsGlobe } from './SkillsGlobe'
import skillsDataRaw from '@/src/data/skills.json'

const skillsData = skillsDataRaw as SkillCategory[]

export function SkillsSection() {
  return (
    <section id="skills" className="section-padding">
      <div className="container">
        {/* Header */}
        <SectionHeader
          terminalPath="~/skills"
          title="Technical Skills"
        />

        {/* 3D Skills Globe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="mt-8 sm:mt-10 md:mt-12"
          style={{ touchAction: 'pan-y' }}
        >
          <SkillsGlobe skillsData={skillsData} />
        </motion.div>
      </div>
    </section>
  )
}
