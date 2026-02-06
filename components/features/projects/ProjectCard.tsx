/**
 * ProjectCard Component
 * Individual project card with hover effects
 */

'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Star } from 'lucide-react'
import { Project } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import TechIcon from '@/components/ui/TechIcon'

interface ProjectCardProps {
  project: Project
  onClick: () => void
  index?: number
}

export function ProjectCard({ project, onClick, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.1 
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="cursor-pointer h-full"
    >
      <Card hover variant="elevated" className="h-full flex flex-col group relative overflow-hidden group relative overflow-hidden">
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Category Badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
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
            
            {/* Featured Star */}
            {project.featured && (
              <Star className="inline-block ml-2 h-4 w-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-5 line-clamp-3 flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.technologies.slice(0, 5).map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:border-primary/40 hover:bg-primary/15 transition-all duration-200"
              title={tech}
            >
              <TechIcon name={tech} className="h-3.5 w-3.5" />
              <span className="text-xs font-medium text-foreground/90">{tech}</span>
            </div>
          ))}
          {project.technologies.length > 5 && (
            <div className="flex items-center px-2.5 py-1.5 rounded-lg bg-muted/30 text-xs font-medium text-muted-foreground">
              +{project.technologies.length - 5}
            </div>
          )}
        </div>

        {/* Footer - Links */}
        <div className="flex gap-4 pt-4 border-t border-primary/10 group-hover:border-primary/20 transition-colors">
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-all hover:translate-x-0.5"
            >
              <Github className="h-4 w-4" />
              <span>Code</span>
            </a>
          )}
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-all hover:translate-x-0.5"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live</span>
            </a>
          )}
          <button
            onClick={onClick}
            className="ml-auto text-sm font-semibold text-primary hover:underline flex items-center gap-1 group/btn"
          >
            View Details
            <span className="inline-block transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
        </div>
        </div>
      </Card>
    </motion.div>
  )
}
