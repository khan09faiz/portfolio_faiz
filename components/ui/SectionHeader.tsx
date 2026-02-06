/**
 * SectionHeader Component
 * Terminal-style section header with title and description
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  terminalPath: string
  title: string
  description?: string | React.ReactNode
  className?: string
  isInView?: boolean
}

export function SectionHeader({
  terminalPath,
  title,
  description,
  className,
  isInView = true,
}: SectionHeaderProps) {
  return (
    <div className={cn('text-center mb-8 sm:mb-12', className)}>
      {/* Terminal Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
      >
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <code className="text-xs sm:text-sm text-muted-foreground font-mono">
          {terminalPath}
        </code>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4"
      >
        <span className="text-gradient">{title}</span>
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
