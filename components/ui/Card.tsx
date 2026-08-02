/**
 * Card Component
 * Reusable card container with glassmorphism effect and variants
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'outlined'
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    // Flat paper surfaces — no glass, no backdrop blur. Depth comes from a
    // hairline rule and a very soft ink shadow, the way a card sitting on a
    // sheet of paper actually reads.
    const variantStyles = {
      default: 'bg-card border border-accent/40 shadow-[0_1px_2px_rgb(var(--sumi)/0.05)]',
      elevated: 'bg-card border border-accent/50 shadow-[0_2px_8px_rgb(var(--sumi)/0.08)]',
      flat: 'bg-card border border-accent/25',
      outlined: 'bg-transparent border-2 border-sumi/25',
    }

    const hoverStyles = hover
      ? 'transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson/45 hover:shadow-[0_6px_18px_rgb(var(--sumi)/0.10)]'
      : ''

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-4 sm:p-6',
          variantStyles[variant],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card subcomponents for better composition

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 mb-4', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl sm:text-2xl font-bold tracking-tight text-foreground',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 mt-4 border-t border-primary/10', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
