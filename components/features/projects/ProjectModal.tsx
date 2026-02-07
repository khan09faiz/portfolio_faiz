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
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal Container with Outside Navigation */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Previous Button - Outside Modal */}
            {onPrevious && (
              <motion.button
                onClick={onPrevious}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.2, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-primary hover:text-primary/80 transition-colors z-50"
                aria-label="Previous project"
              >
                <ChevronLeft className="h-8 w-8 drop-shadow-glow" />
              </motion.button>
            )}

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-card/40 backdrop-blur-md border border-primary/20 rounded-xl shadow-glow-lg"
            >
              {/* Close Button - Clean Design */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="sticky top-4 float-right mr-4 mt-4 p-2 text-primary hover:text-red-400 transition-colors z-20"
                aria-label="Close modal"
              >
                <X className="h-6 w-6 drop-shadow-glow" />
              </motion.button>

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

            {/* Next Button - Outside Modal */}
            {onNext && (
              <motion.button
                onClick={onNext}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.2, x: 5 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-primary hover:text-primary/80 transition-colors z-50"
                aria-label="Next project"
              >
                <ChevronRight className="h-8 w-8 drop-shadow-glow" />
              </motion.button>
            )}
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
