/**
 * InteractiveCat Component
 * Cat that plays with wool in corner, follows mouse when clicked
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CORNER_X = 80
const IDLE_TIMEOUT = 5000 // 5 seconds

export function InteractiveCat() {
  const [cornerY, setCornerY] = useState(0)
  const [position, setPosition] = useState({ x: CORNER_X, y: 0 })
  const [targetPosition, setTargetPosition] = useState({ x: CORNER_X, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPetting, setIsPetting] = useState(false)
  const [showMeow, setShowMeow] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const animationFrameRef = useRef<number | null>(null)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastMouseMoveRef = useRef<number>(Date.now())

  // Initialize corner position on mount
  useEffect(() => {
    const initialY = window.innerHeight - 80
    setCornerY(initialY)
    setPosition({ x: CORNER_X, y: initialY })
    setTargetPosition({ x: CORNER_X, y: initialY })

    // Update corner Y on window resize
    const handleResize = () => {
      const newY = window.innerHeight - 80
      setCornerY(newY)
      if (isPlaying) {
        setTargetPosition({ x: CORNER_X, y: newY })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isPlaying])

  // Smooth position interpolation - Optimized with throttling
  useEffect(() => {
    let lastTime = 0
    const frameTime = 1000 / 60 // 60 FPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameTime) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      setPosition((prev) => {
        const dx = targetPosition.x - prev.x
        const dy = targetPosition.y - prev.y
        const distanceSq = dx * dx + dy * dy // Avoid sqrt for performance

        if (distanceSq < 25) { // 5 squared
          setIsRunning(false)
          return prev
        }

        setIsRunning(true)
        const speed = 0.12 // Slightly faster for smoother movement
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [targetPosition])

  // Return to corner after idle
  const returnToCorner = useCallback(() => {
    setIsFollowing(false)
    setIsPlaying(true)
    setTargetPosition({ x: CORNER_X, y: cornerY })
    setRotation(0)
  }, [cornerY])

  // Handle mouse move with throttling for better performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    lastMouseMoveRef.current = Date.now()

    // Reset idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    // Start new idle timer
    idleTimerRef.current = setTimeout(returnToCorner, IDLE_TIMEOUT)

    if (!isFollowing) return

    const mouseX = e.clientX
    const mouseY = e.clientY
    const dx = mouseX - position.x
    const dy = mouseY - position.y
    const distSq = dx * dx + dy * dy // Avoid sqrt for performance

    // Check if petting (very close to cat)
    if (distSq < 1600) { // 40 squared
      setIsPetting(true)
      setIsRunning(false)
      setIsPlaying(false)
      if (!showMeow) {
        setShowMeow(true)
        setTimeout(() => setShowMeow(false), 2000)
      }
    } else {
      setIsPetting(false)
      if (distSq > 3600) { // 60 squared
        setIsPlaying(false)
        const angle = Math.atan2(dy, dx)
        setRotation(angle * (180 / Math.PI))
        setTargetPosition({ x: mouseX, y: mouseY })
      }
    }
  }, [position.x, position.y, showMeow, isFollowing, returnToCorner])

  // Handle click on cat
  const handleCatClick = useCallback(() => {
    setIsFollowing(true)
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    
    // Start idle timer on mount
    idleTimerRef.current = setTimeout(returnToCorner, IDLE_TIMEOUT)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [handleMouseMove, returnToCorner])

  // Don't render until position is initialized
  if (cornerY === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) rotate(${
          isPlaying || isPetting ? 0 : rotation
        }deg)`,
        cursor: isFollowing ? 'default' : 'pointer',
        zIndex: 9999,
        willChange: 'transform',
      }}
      onClick={handleCatClick}
    >
      <div className="relative">
        {/* Wool Ball - Only visible when playing - Using CSS animations for performance */}
        {isPlaying && (
          <div
            className="absolute"
            style={{ 
              left: '30px', 
              top: '10px',
              animation: 'woolBounce 1.2s ease-in-out infinite',
              willChange: 'transform'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
              <circle cx="10" cy="10" r="6" fill="#F87171" opacity="0.6" />
              {/* Yarn texture */}
              <path d="M 5 10 Q 10 5 15 10 Q 10 15 5 10" stroke="#DC2626" strokeWidth="0.8" fill="none" />
              <path d="M 10 5 Q 5 10 10 15 Q 15 10 10 5" stroke="#DC2626" strokeWidth="0.8" fill="none" />
            </svg>
          </div>
        )}

        {/* Petting Hand - appears when petting */}
        {isPetting && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ 
              opacity: 1, 
              y: [0, -2, 0],
            }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ 
              opacity: { duration: 0.2 },
              y: {
                duration: 0.6,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1] as const
              }
            }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          >
            {/* Hand SVG - Smaller */}
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              {/* Palm */}
              <ellipse cx="16" cy="20" rx="8" ry="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
              
              {/* Thumb */}
              <path 
                d="M 10 18 Q 6 16 6 12 Q 6 9 8 9 Q 10 9 10 11 L 10 18" 
                fill="#FBBF24" 
                stroke="#F59E0B" 
                strokeWidth="1.5"
              />
              
              {/* Index Finger */}
              <rect 
                x="12" 
                y="6" 
                width="3.5" 
                height="14" 
                rx="1.75" 
                fill="#FBBF24" 
                stroke="#F59E0B" 
                strokeWidth="1.5"
              />
              
              {/* Middle Finger */}
              <rect 
                x="16.5" 
                y="4" 
                width="3.5" 
                height="16" 
                rx="1.75" 
                fill="#FBBF24" 
                stroke="#F59E0B" 
                strokeWidth="1.5"
              />
              
              {/* Ring Finger */}
              <rect 
                x="21" 
                y="6" 
                width="3.5" 
                height="14" 
                rx="1.75" 
                fill="#FBBF24" 
                stroke="#F59E0B" 
                strokeWidth="1.5"
              />
              
              {/* Highlights for depth */}
              <ellipse cx="14" cy="22" rx="2" ry="3" fill="#FCD34D" opacity="0.6" />
              <ellipse cx="18" cy="22" rx="2" ry="3" fill="#FCD34D" opacity="0.6" />
            </svg>
          </motion.div>
        )}

        {/* Cat SVG */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 60 60"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        >
          {/* Body */}
          <ellipse
            cx="30"
            cy={isPetting ? "38" : isPlaying ? "36" : "35"}
            rx="14"
            ry={isPetting ? "10" : isPlaying ? "11" : "12"}
            fill="#F3F4F6"
            stroke="#9CA3AF"
            strokeWidth="1.5"
          />

          {/* Head */}
          <circle cx="30" cy="20" r="11" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />

          {/* Left Ear */}
          <path d="M 22 12 L 18 5 L 25 10 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M 22 11 L 20 7 L 24 11 Z" fill="#FCA5A5" />

          {/* Right Ear */}
          <path d="M 38 12 L 42 5 L 35 10 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
          <path d="M 38 11 L 40 7 L 36 11 Z" fill="#FCA5A5" />

          {/* Eyes */}
          {isPetting ? (
            <>
              {/* Closed happy eyes when petting */}
              <path d="M 23 18 Q 25 20 27 18" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 33 18 Q 35 20 37 18" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          ) : isPlaying ? (
            <>
              {/* Focused eyes when playing */}
              <ellipse cx="25" cy="18" rx="3" ry="2.5" fill="#1F2937" />
              <ellipse cx="35" cy="18" rx="3" ry="2.5" fill="#1F2937" />
              <circle cx="25.8" cy="17.5" r="1" fill="#FFFFFF" />
              <circle cx="35.8" cy="17.5" r="1" fill="#FFFFFF" />
            </>
          ) : (
            <>
              {/* Normal eyes */}
              <circle cx="25" cy="18" r="2.5" fill="#1F2937" />
              <circle cx="35" cy="18" r="2.5" fill="#1F2937" />
              <circle cx="25.8" cy="17.5" r="1" fill="#FFFFFF" />
              <circle cx="35.8" cy="17.5" r="1" fill="#FFFFFF" />
            </>
          )}

          {/* Nose */}
          <ellipse cx="30" cy="23" rx="2" ry="1.5" fill="#FCA5A5" />

          {/* Mouth */}
          <path d="M 30 24 Q 27 26 24 25" stroke="#9CA3AF" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 30 24 Q 33 26 36 25" stroke="#9CA3AF" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="14" y1="20" x2="4" y2="19" stroke="#9CA3AF" strokeWidth="1" opacity="0.7" />
          <line x1="14" y1="22" x2="4" y2="23" stroke="#9CA3AF" strokeWidth="1" opacity="0.7" />
          <line x1="46" y1="20" x2="56" y2="19" stroke="#9CA3AF" strokeWidth="1" opacity="0.7" />
          <line x1="46" y1="22" x2="56" y2="23" stroke="#9CA3AF" strokeWidth="1" opacity="0.7" />

          {/* Tail - Animated when playing */}
          {!isPetting && (
            <path
              d="M 16 35 Q 8 35 6 40 Q 5 44 9 46"
              stroke="#9CA3AF"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            >
              {(isRunning || isPlaying) && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 16 35; 15 16 35; -15 16 35; 0 16 35"
                  dur={isPlaying ? "0.6s" : "0.4s"}
                  repeatCount="indefinite"
                />
              )}
            </path>
          )}

          {/* Front Paws - Animated when playing */}
          {isPetting ? (
            <>
              <line x1="23" y1="45" x2="20" y2="50" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="37" y1="45" x2="40" y2="50" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="20" cy="50" r="1.5" fill="#FCA5A5" />
              <circle cx="40" cy="50" r="1.5" fill="#FCA5A5" />
            </>
          ) : isPlaying ? (
            <>
              <line x1="23" y1="44" x2="23" y2="51" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y2" values="51;48;51" dur="0.4s" repeatCount="indefinite" />
              </line>
              <line x1="37" y1="44" x2="37" y2="51" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y2" values="48;51;48" dur="0.4s" repeatCount="indefinite" begin="0.2s" />
              </line>
            </>
          ) : isRunning ? (
            <>
              <line x1="23" y1="45" x2="23" y2="52" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y2" values="52;48;52" dur="0.25s" repeatCount="indefinite" />
              </line>
              <line x1="37" y1="45" x2="37" y2="52" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y2" values="48;52;48" dur="0.25s" repeatCount="indefinite" />
              </line>
            </>
          ) : (
            <>
              <line x1="23" y1="45" x2="23" y2="50" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="37" y1="45" x2="37" y2="50" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </svg>

        {/* Meow text - Only when petting - Left side */}
        {isPetting && showMeow && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.5 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
            className="absolute top-0 -left-16 text-lg whitespace-nowrap"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              textShadow: '0 0 10px rgba(255,255,255,0.8)',
              willChange: 'transform',
            }}
          >
            😺
            <span className="ml-0.5 text-sm font-bold text-pink-400" style={{ textShadow: '0 0 10px rgba(244,114,182,0.8)' }}>
              Meow!
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
