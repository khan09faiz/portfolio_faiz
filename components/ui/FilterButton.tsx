/**
 * FilterButton Component
 * Category filter button with active state
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FilterButtonProps {
  label: string
  count?: number
  isActive: boolean
  onClick: () => void
}

export function FilterButton({
  label,
  count,
  isActive,
  onClick,
}: FilterButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm',
        isActive
          ? 'bg-primary text-background shadow-glow-md hover:shadow-glow-lg'
          : 'bg-card/40 text-muted-foreground hover:bg-card/60 hover:text-foreground border border-primary/10 hover:border-primary/30'
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            'ml-2 text-xs px-2 py-0.5 rounded-full font-bold',
            isActive
              ? 'bg-background/25 text-background'
              : 'bg-primary/15 text-primary'
          )}
        >
          {count}
        </span>
      )}
    </motion.button>
  )
}

// FilterButtonGroup for layout
interface FilterButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export function FilterButtonGroup({
  children,
  className,
}: FilterButtonGroupProps) {
  return (
    <div className={cn('flex flex-wrap gap-3 justify-center', className)}>
      {children}
    </div>
  )
}
