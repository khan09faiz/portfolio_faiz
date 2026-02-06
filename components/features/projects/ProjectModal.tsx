/**
 * ProjectModal Component
 * Detailed project view in a modal
 */

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Project } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import TechIcon from '@/components/ui/TechIcon'
import { useEffect } from 'react'

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export function ProjectModal({
  project,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: ProjectModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-card/40 backdrop-blur-md border border-primary/20 rounded-xl shadow-glow-lg"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 hover:shadow-glow-sm transition-all z-10"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Navigation Buttons */}
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 hover:shadow-glow-sm transition-all"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-lg bg-card/50 border border-primary/10 hover:border-primary/30 hover:shadow-glow-sm transition-all"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.category === 'AI/ML'
                          ? 'bg-blue-500/20 text-blue-400'
                          : project.category === 'Frontend'
                          ? 'bg-purple-500/20 text-purple-400'
                          : project.category === 'Backend'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}
                    >
                      {project.category}
                    </span>
                    <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                      {new Date(project.date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gradient mb-3">
                    {project.title}
                  </h2>
                  
                  <p className="text-lg text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                {/* Long Description */}
                {project.longDescription && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="text-primary">{'// '}</span>
                      About the Project
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.longDescription}
                    </p>
                  </div>
                )}

                {/* Key Features */}
                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="text-primary">{'// '}</span>
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {project.keyFeatures.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-muted-foreground"
                        >
                          <span className="text-primary mt-1">▹</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary">{'// '}</span>
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors"
                      >
                        <TechIcon name={tech} className="h-5 w-5" />
                        <span className="text-sm font-medium">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Metrics */}
                {project.impact && project.impact.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <span className="text-primary">{'// '}</span>
                      Impact & Metrics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {project.impact.map((metric, index) => (
                        <div
                          key={index}
                          className="bg-card/30 rounded-lg p-4 border border-primary/10"
                        >
                          <div className="text-2xl font-bold text-primary mb-1">
                            {metric.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button icon={<Github className="h-5 w-5" />}>
                        View Code
                      </Button>
                    </a>
                  )}
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        icon={<ExternalLink className="h-5 w-5" />}
                      >
                        Live Demo
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
