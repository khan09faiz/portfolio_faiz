/**
 * InkCursor
 * A brush-stroke trail that follows the pointer, tapering and fading like wet
 * sumi ink drying on paper.
 *
 * ACCESSIBILITY NOTE — this ACCOMPANIES the system cursor, it does not replace
 * it. docs/UI_DESIGN.md lists an "ink cursor", but hiding the real pointer
 * costs precision for anyone with a motor impairment, breaks the cursor shape
 * cues browsers give over text and links, and is a well-known usability
 * regression. The trail gives the same effect without taking anything away.
 *
 * Gated on `pointer: fine`, so it never mounts on touch devices, and disabled
 * entirely under prefers-reduced-motion.
 */

'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

interface TrailPoint {
  x: number
  y: number
  life: number
}

const MAX_POINTS = 18
const FADE_PER_FRAME = 0.055

export function InkCursor() {
  const prefersReducedMotion = useReducedMotion()
  const hasFinePointer = useMediaQuery('(pointer: fine)', false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const enabled = hasFinePointer && !prefersReducedMotion

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const points: TrailPoint[] = []
    let frame = 0

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (event: MouseEvent) => {
      points.push({ x: event.clientX, y: event.clientY, life: 1 })
      if (points.length > MAX_POINTS) points.shift()
    }

    const readInk = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--sumi')
        .trim()
      const parts = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite)
      return parts.length === 3 ? parts : [26, 24, 22]
    }

    let ink = readInk()
    const observer = new MutationObserver(() => {
      ink = readInk()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ink'],
    })

    const draw = () => {
      frame = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = points.length - 1; i >= 0; i--) {
        points[i].life -= FADE_PER_FRAME
        if (points[i].life <= 0) points.splice(i, 1)
      }
      if (points.length < 2) return

      const [r, g, b] = ink
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Draw as overlapping segments so the stroke can taper: a single path
      // cannot vary its width along its length on a 2D context.
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const t = i / points.length
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${curr.life * 0.5})`
        ctx.lineWidth = 1 + t * 5
        ctx.moveTo(prev.x, prev.y)
        ctx.lineTo(curr.x, curr.y)
        ctx.stroke()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  )
}
