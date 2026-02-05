/**
 * Certificates Section
 * Displays professional certifications and education
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCheck, GraduationCap, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface Certificate {
  title: string
  issuer: string
  date: string
  credentialId: string
  credentialUrl: string
  logo: string
  category: 'ai-ml' | 'data' | 'design' | 'business'
}

const certificates: Certificate[] = [
  {
    title: 'Exploratory Data Analysis for Machine Learning',
    issuer: 'IBM',
    date: 'Apr 2024',
    credentialId: 'GLWUN5RJ28P4',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/GLWUN5RJ28P4',
    logo: '🎓',
    category: 'ai-ml',
  },
  {
    title: 'Introduction to Computer Vision and Image Processing',
    issuer: 'IBM',
    date: 'Apr 2025',
    credentialId: 'BKEC9L8VMX8J',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/BKEC9L8VMX8J',
    logo: '🎓',
    category: 'ai-ml',
  },
  {
    title: 'Creative Designing in Power BI',
    issuer: 'Microsoft',
    date: 'Nov 2024',
    credentialId: '4B29FNLDY6BR',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/4B29FNLDY6BR',
    logo: '📊',
    category: 'design',
  },
  {
    title: 'Completing the Accounting Cycle',
    issuer: 'University of California, Irvine - The Paul Merage School of Business',
    date: 'Mar 2024',
    credentialId: 'X999GMBMZ9QJ',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/X999GMBMZ9QJ',
    logo: '🏛️',
    category: 'business',
  },
]

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold">Education</h3>
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
          <h3 className="text-3xl font-bold">Professional Certifications</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {displayedCertificates.map((cert, index) => (
            <motion.div
              key={cert.credentialId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col hover:border-cyan-500/30 transition-all group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {cert.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
                      {cert.title}
                    </h4>
                    <p className="text-sm font-semibold text-primary mb-1">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground">Issued {cert.date}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-xs text-muted-foreground mb-3">
                    <span className="font-mono">ID: {cert.credentialId}</span>
                  </div>
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm font-medium transition-all w-full justify-center group-hover:border-cyan-500/40"
                  >
                    Show credential
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {hasMore && (
          <div className="text-center">
            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-cyan-500/10 border border-cyan-500/20 rounded-lg transition-all"
              >
                <ChevronDown className="h-5 w-5" />
                View {certificates.length - 3} More Certificate{certificates.length - 3 > 1 ? 's' : ''}
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-cyan-500/10 border border-cyan-500/20 rounded-lg transition-all"
              >
                <ChevronUp className="h-5 w-5" />
                View Less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
