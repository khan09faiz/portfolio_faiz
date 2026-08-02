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
import type { TimelineItem } from '@/lib/types'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

/**
 * Formats a YYYY-MM string as "Jun 2025".
 * Parsed from the string rather than via `new Date()` — see the note in
 * TimelineSection: the Date route rolls back a month west of UTC and caused a
 * server/client hydration mismatch.
 */
const formatDate = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-')
  const name = MONTHS[Number(month) - 1]
  return name ? `${name} ${year}` : yearMonth
}

const education = {
  degree: 'Bachelor of Technology (B.Tech)',
  field: 'Computer Science Engineering',
  university: 'Manipal University Jaipur',
  graduation: '2026',
  gpa: '8.5',
  logo: '🎓',
}

interface CertificatesSectionProps {
  /**
   * Achievement-type timeline entries, most recent first — use
   * getCertificates() from lib/content on the server to build this.
   *
   * NOTE: this component is still not rendered anywhere (see the audit in
   * progress/CURRENT_STATE.md). It is converted to props alongside the others
   * so it does not become the one place still reaching into lib/content.
   */
  certificates: TimelineItem[]
}

export function CertificatesSection({ certificates }: CertificatesSectionProps) {
  const [showAll, setShowAll] = useState(false)

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
          exit={{ opacity: 0, y: -20 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-sumi/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-sumi" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">Education</h3>
          </div>
          
          <Card className="p-6 md:p-8 bg-gradient-to-br from-sumi/5 to-sumi/5 border-sumi/20">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-sumi/10 flex items-center justify-center text-4xl flex-shrink-0">
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
                    <span className="font-semibold text-sumi">{education.gpa}/10.0</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Certifications */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-crimson/10 flex items-center justify-center">
            <FileCheck className="h-6 w-6 text-crimson" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">Professional Certifications</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {displayedCertificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="p-6 h-full flex flex-col hover:border-crimson/30 transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-crimson/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-crimson" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-crimson transition-colors line-clamp-2">
                      {cert.title}
                    </h4>
                    <p className="text-sm font-semibold text-primary mb-1">{cert.organization}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground" suppressHydrationWarning>
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
                        className="px-2 py-1 text-xs rounded bg-crimson/10 border border-crimson/20 text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                    {cert.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded bg-crimson/10 border border-crimson/20 text-foreground">
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
              className="group inline-flex items-center gap-2 text-crimson hover:text-crimson transition-colors cursor-pointer"
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
                  duration: 0.5,
                  ease: [0.4, 0, 0.6, 1] as const
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
