/**
 * TimelineSection Component
 * Display career and education timeline
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Calendar, Award, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
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
    case 'achievement':
      return Award
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
    case 'achievement':
      return 'text-yellow-400 bg-yellow-500/20'
    default:
      return 'text-primary bg-primary/20'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function TimelineSection() {
  const [showAllCertificates, setShowAllCertificates] = useState(false)

  // Separate items by type
  const workExperience = timelineData
    .filter((item) => item.type === 'work')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  
  const education = timelineData
    .filter((item) => item.type === 'education')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  
  const certificates = timelineData
    .filter((item) => item.type === 'achievement')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, 3)
  const hasMoreCertificates = certificates.length > 3

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

        {/* Certificates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-400" />
            Certifications & Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCertificates.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card hover variant="elevated" className="h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.organization}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.startDate)}
                  </div>

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded bg-primary/10 border border-primary/20 text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                      {item.technologies.length > 3 && (
                        <span className="px-2 py-0.5 text-xs rounded bg-primary/10 border border-primary/20 text-foreground/80">
                          +{item.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Show More/Less */}
          {hasMoreCertificates && (
            <motion.div 
              className="text-center mt-8"
              whileHover={{ scale: 1.05 }}
            >
              <button
                onClick={() => setShowAllCertificates(!showAllCertificates)}
                className="group inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
              >
                <span className="font-medium">
                  {!showAllCertificates 
                    ? `View ${certificates.length - 3} More Certificate${certificates.length - 3 > 1 ? 's' : ''}`
                    : 'View Less'
                  }
                </span>
                <motion.div
                  animate={{ y: showAllCertificates ? -2 : 2 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 0.8,
                    ease: "easeInOut"
                  }}
                >
                  {!showAllCertificates ? (
                    <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                  ) : (
                    <ChevronUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                  )}
                </motion.div>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
