/**
 * LoadingSkeleton Component
 * Loading states for different page variants
 */

import { memo } from 'react'

interface LoadingSkeletonProps {
  variant?: 'page' | 'projects' | 'skills' | 'timeline' | 'github' | 'contact'
}

export const LoadingSkeleton = memo(function LoadingSkeleton({
  variant = 'page',
}: LoadingSkeletonProps) {
  if (variant === 'projects') {
    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="h-8 sm:h-10 md:h-12 bg-primary/10 rounded-lg w-40 sm:w-48 md:w-64 mx-auto" />
            <div className="h-3 sm:h-4 md:h-6 bg-primary/5 rounded w-11/12 sm:w-3/4 md:w-2/3 mx-auto" />
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-primary/10 rounded-lg" />
            ))}
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 space-y-4 border border-primary/10"
              >
                <div className="h-6 bg-primary/10 rounded w-3/4" />
                <div className="h-4 bg-primary/5 rounded w-full" />
                <div className="h-4 bg-primary/5 rounded w-5/6" />
                <div className="flex gap-2 flex-wrap">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-6 w-16 bg-primary/10 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'skills') {
    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="h-10 bg-primary/10 rounded-lg w-48 mx-auto" />
            <div className="h-4 bg-primary/5 rounded w-2/3 mx-auto" />
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 space-y-4 border border-primary/10"
              >
                <div className="h-6 bg-primary/10 rounded w-2/3" />
                <div className="h-2 bg-primary/10 rounded w-full" />
                <div className="flex gap-2 flex-wrap">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-8 w-20 bg-primary/10 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'timeline') {
    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="h-10 bg-primary/10 rounded-lg w-56 mx-auto" />
            <div className="h-4 bg-primary/5 rounded w-3/4 mx-auto" />
          </div>

          {/* Timeline Items */}
          <div className="max-w-4xl mx-auto space-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10" />
                  {i < 3 && <div className="w-0.5 flex-1 bg-primary/10 mt-2" />}
                </div>
                <div className="flex-1 bg-card rounded-xl p-6 border border-primary/10 space-y-3">
                  <div className="h-6 bg-primary/10 rounded w-2/3" />
                  <div className="h-4 bg-primary/5 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/5 rounded w-full" />
                    <div className="h-3 bg-primary/5 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'github') {
    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="h-10 bg-primary/10 rounded-lg w-64 mx-auto" />
            <div className="h-4 bg-primary/5 rounded w-2/3 mx-auto" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 space-y-2 border border-primary/10"
              >
                <div className="h-8 bg-primary/10 rounded w-16 mx-auto" />
                <div className="h-4 bg-primary/5 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>

          {/* Heatmap */}
          <div className="bg-card rounded-xl p-6 border border-primary/10">
            <div className="h-6 bg-primary/10 rounded w-48 mb-4" />
            <div className="h-32 bg-primary/5 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'contact') {
    return (
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="animate-pulse space-y-6 sm:space-y-8 max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="h-10 bg-primary/10 rounded-lg w-56 mx-auto" />
            <div className="h-4 bg-primary/5 rounded w-3/4 mx-auto" />
          </div>

          {/* Form */}
          <div className="bg-card rounded-xl p-6 sm:p-8 border border-primary/10 space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-primary/10 rounded w-16" />
              <div className="h-12 bg-primary/5 rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-primary/10 rounded w-16" />
              <div className="h-12 bg-primary/5 rounded w-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-primary/10 rounded w-20" />
              <div className="h-32 bg-primary/5 rounded w-full" />
            </div>
            <div className="h-12 bg-primary/10 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Default 'page' variant
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="animate-pulse space-y-6 sm:space-y-8">
        {/* Hero Skeleton */}
        <div className="text-center space-y-4 mb-12">
          <div className="h-12 sm:h-16 bg-primary/10 rounded-lg w-3/4 mx-auto" />
          <div className="h-8 sm:h-10 bg-primary/5 rounded w-1/2 mx-auto" />
          <div className="h-6 bg-primary/5 rounded w-2/3 mx-auto" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-6 space-y-4 border border-primary/10"
            >
              <div className="h-6 bg-primary/10 rounded w-3/4" />
              <div className="h-4 bg-primary/5 rounded w-full" />
              <div className="h-4 bg-primary/5 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})
