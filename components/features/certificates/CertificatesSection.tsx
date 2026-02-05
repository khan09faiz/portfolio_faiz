/**
 * Certificates Section
 * Displays professional certifications and education
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCheck, GraduationCap, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TimelineItem } from '@/lib/types'
import timelineDataRaw from '@/src/data/timeline.json'

const timelineData = timelineDataRaw as TimelineItem[]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const education = {
  degree: 'Bachelor of Technology (B.Tech)',
  field: 'Computer Science Engineering',
  university: 'Manipal University Jaipur',
  graduation: '2026',
  gpa: '8.5',
  logo: '🎓',
}

export function CertificatesSection() {
  const [showAll, setShowAll] = useState(false)

  // Get certificates from timeline data
  const certificates = timelineData
    .filter((item) => item.type === 'achievement')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  const displayedCertificates = showAll ? certificates : certificates.slice(0, 3)
  const hasMore = certificates.length > 3

  return (
    <section id="certificates" className="section-padding">
      <div className="container">
        <SectionHeader
          terminalPath="~/certificates"
          title="Certifications & Education"
          description="Professional certifications and academic achievements"
        />

        {/* Education Card */}
        <motion.div
          id="education"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">Education</h3>
          </div>
          
          <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-green-500/10 flex items-center justify-center text-4xl flex-shrink-0">
                {education.logo}
              </div>
              <div className="flex-1">
                <h4 className="text-xl md:text-2xl font-bold mb-2">{education.degree}</h4>
                <p className="text-lg text-primary font-semibold mb-2">{education.field}</p>
                <p className="text-muted-foreground mb-3">{education.university}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Expected Graduation:</span>
                    <span className="font-semibold text-foreground">{education.graduation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">GPA:</span>
                    <span className="font-semibold text-green-500">{education.gpa}/10.0</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Certifications */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <FileCheck className="h-6 w-6 text-cyan-500" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">Professional Certifications</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {displayedCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col hover:border-cyan-500/30 transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-cyan-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
                      {cert.title}
                    </h4>
                    <p className="text-sm font-semibold text-primary mb-1">{cert.organization}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(cert.startDate)}
                    </div>
                  </div>
                </div>

                {cert.technologies && cert.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {cert.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded bg-cyan-500/10 border border-cyan-500/20 text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {cert.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded bg-cyan-500/10 border border-cyan-500/20 text-foreground">
                        +{cert.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less */}
        {hasMore && (
          <motion.div 
            className="text-center mt-8"
            whileHover={{ scale: 1.05 }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              <span className="font-medium">
                {!showAll 
                  ? `View ${certificates.length - 3} More Certificate${certificates.length - 3 > 1 ? 's' : ''}`
                  : 'View Less'
                }
              </span>
              <motion.div
                animate={{ y: showAll ? -2 : 2 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 0.8,
                  ease: [0.4, 0, 0.6, 1]
                }}
              >
                {!showAll ? (
                  <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                ) : (
                  <ChevronUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                )}
              </motion.div>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
