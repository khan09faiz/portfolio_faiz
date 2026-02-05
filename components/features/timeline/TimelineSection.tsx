/**
 * TimelineSection Component
 * Display career and education timeline
 */

'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Calendar } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import TechIcon from '@/components/ui/TechIcon'
import { Card } from '@/components/ui/Card'
import { TimelineItem } from '@/lib/types'
import timelineDataRaw from '@/src/data/timeline.json'

const timelineData = timelineDataRaw as TimelineItem[]

const getIcon = (type: string) => {
  switch (type) {
    case 'work':
      return Briefcase
    case 'education':
      return GraduationCap
    default:
      return Briefcase
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'work':
      return 'text-blue-400 bg-blue-500/20'
    case 'education':
      return 'text-purple-400 bg-purple-500/20'
    default:
      return 'text-primary bg-primary/20'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function TimelineSection() {
  // Separate items by type
  const workExperience = timelineData
    .filter((item) => item.type === 'work')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  
  const education = timelineData
    .filter((item) => item.type === 'education')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  return (
    <section id="timeline" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <SectionHeader
          terminalPath="~/career"
          title="Career Journey"
          description="Professional experience, education, and certifications"
        />

        {/* Work Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-400" />
            Work Experience
          </h3>
          <div className="space-y-6">
            {workExperience.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover variant="elevated">
                  <div className="mb-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-xl font-bold text-foreground">
                        {item.title}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        @ {item.organization}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.startDate)} -{' '}
                        {item.endDate ? formatDate(item.endDate) : 'Present'}
                      </span>
                      {item.location && (
                        <span>📍 {item.location}</span>
                      )}
                    </div>
                  </div>

                  {item.description && item.description.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {item.description.map((desc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">▹</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 hover:border-primary/30 transition-colors"
                        >
                          <TechIcon name={tech} className="h-3.5 w-3.5" />
                          <span className="text-xs text-foreground/90">{tech}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-purple-400" />
            Education
          </h3>
          <div className="space-y-6">
            {education.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover variant="elevated">
                  <div className="mb-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-xl font-bold text-foreground">
                        {item.title}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        @ {item.organization}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.startDate)} -{' '}
                        {item.endDate ? formatDate(item.endDate) : 'Present'}
                      </span>
                      {item.location && (
                        <span>📍 {item.location}</span>
                      )}
                    </div>
                  </div>

                  {item.description && item.description.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {item.description.map((desc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">▹</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 hover:border-primary/30 transition-colors"
                        >
                          <TechIcon name={tech} className="h-3.5 w-3.5" />
                          <span className="text-xs text-foreground/90">{tech}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
