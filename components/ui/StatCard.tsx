/**
 * StatCard Component
 * Animated statistics display card with icon
 */

'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  color?: string
  fill?: string
  isActive?: boolean
  index?: number
}

export function StatCard({
  icon: Icon,
  value,
  label,
  color = 'text-primary',
  fill = 'fill-primary/20',
  isActive = true,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isActive ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative group',
        'bg-card/30 backdrop-blur-md',
        'border border-primary/10',
        'rounded-xl p-4',
        'hover:border-primary/30 hover:shadow-glow-sm',
        'transition-all duration-300'
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-center mb-2">
        <div className={cn('p-2 rounded-lg bg-primary/10', fill)}>
          <Icon className={cn('h-5 w-5', color)} />
        </div>
      </div>

      {/* Value */}
      <div className={cn('text-xl sm:text-2xl font-bold text-center mb-1', color)}>
        {value}
      </div>

      {/* Label */}
      <div className="text-xs sm:text-sm text-muted-foreground text-center">
        {label}
      </div>
    </motion.div>
  )
}

// StatCardGrid for layout
interface StatCardGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatCardGrid({
  children,
  columns = 4,
  className,
}: StatCardGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  )
}
