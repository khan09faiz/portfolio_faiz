/**
 * BrushCursor
 * Replaces the pointer with a sumi brush that paints a wet ink trail.
 *
 * Two layers:
 *  - a canvas trail, drawn as several offset strands so the stroke splays like
 *    loaded bristles rather than reading as a single vector line
 *  - a brush graphic that leans into the direction of travel
 *
 * ACCESSIBILITY — this HIDES the system cursor, which is a real trade-off:
 * pointer precision and the browser's built-in shape cues over links and text
 * both suffer. It is therefore gated hard:
 *   - `pointer: fine` only, so touch and coarse pointers are untouched
 *   - disabled entirely under prefers-reduced-motion, which restores the
 *     native cursor
 *   - the brush swells and turns vermillion over interactive targets, to give
 *     back the affordance the native pointer would have provided
 */

'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

interface TrailPoint {
  x: number
  y: number
  life: number
  width: number
}

const MAX_POINTS = 26
const FADE = 0.035
const STRANDS = 3

export function BrushCursor() {
  const prefersReducedMotion = useReducedMotion()
  const hasFinePointer = useMediaQuery('(pointer: fine)', false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const brushRef = useRef<HTMLDivElement>(null)

  const enabled = hasFinePointer && !prefersReducedMotion

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    const brush = brushRef.current
    if (!canvas || !brush) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const points: TrailPoint[] = []
    let frame = 0
    let mx = -100
    let my = -100
    let px = -100
    let py = -100
    let angle = -0.6
    let over = false

    // Hide the native cursor only once we know the brush is actually active.
    document.documentElement.classList.add('brush-cursor-active')

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      const dx = mx - px
      const dy = my - py
      const speed = Math.hypot(dx, dy)
      // Faster travel = thinner stroke, the way a real brush drags out.
      points.push({ x: mx, y: my, life: 1, width: Math.max(1.6, 7 - speed * 0.16) })
      if (points.length > MAX_POINTS) points.shift()

      const target = e.target as Element | null
      over = !!target?.closest('a, button, input, textarea, select, [role="button"]')
    }

    const readToken = (name: string, fallback: number[]) => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      const p = raw.split(/[\s,]+/).map(Number).filter(Number.isFinite)
      return p.length === 3 ? p : fallback
    }

    let sumi = readToken('--sumi', [26, 24, 22])
    let vermillion = readToken('--vermillion', [191, 42, 34])
    const observer = new MutationObserver(() => {
      sumi = readToken('--sumi', sumi)
      vermillion = readToken('--vermillion', vermillion)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ink'] })

    const draw = () => {
      frame = requestAnimationFrame(draw)

      // Ease the brush toward the pointer so it trails with a little weight.
      px += (mx - px) * 0.35
      py += (my - py) * 0.35
      const dx = mx - px
      const dy = my - py
      if (Math.hypot(dx, dy) > 0.6) {
        const targetAngle = Math.atan2(dy, dx)
        let delta = targetAngle - angle
        while (delta > Math.PI) delta -= Math.PI * 2
        while (delta < -Math.PI) delta += Math.PI * 2
        angle += delta * 0.2
      }

      brush.style.transform = `translate3d(${px}px, ${py}px, 0) rotate(${angle + Math.PI / 4}rad) scale(${over ? 1.25 : 1})`
      brush.dataset.over = over ? 'true' : 'false'

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = points.length - 1; i >= 0; i--) {
        points[i].life -= FADE
        if (points[i].life <= 0) points.splice(i, 1)
      }
      if (points.length < 2) return

      const [r, g, b] = over ? vermillion : sumi
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Several strands, each nudged perpendicular to travel, so the stroke
      // splays the way loaded bristles do.
      for (let s = 0; s < STRANDS; s++) {
        const off = (s - (STRANDS - 1) / 2) * 1.5
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1]
          const c = points[i]
          const t = i / points.length
          const nx = -(c.y - a.y)
          const ny = c.x - a.x
          const len = Math.hypot(nx, ny) || 1
          const ox = (nx / len) * off
          const oy = (ny / len) * off
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${c.life * 0.34 * t})`
          ctx.lineWidth = c.width * (1 - Math.abs(off) * 0.12)
          ctx.moveTo(a.x + ox, a.y + oy)
          ctx.lineTo(c.x + ox, c.y + oy)
          ctx.stroke()
        }
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
      document.documentElement.classList.remove('brush-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]" />
      <div
        ref={brushRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[61] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {/* Brush, drawn tip-first at the origin so it pivots on the point that
            actually touches the paper. */}
        <svg width="42" height="42" viewBox="0 0 42 42" style={{ marginLeft: -4, marginTop: -4 }}>
          {/* bristles */}
          <path
            d="M 4 4 C 9 7 12 10 15 15 C 12 17 9 18 6 17 C 5 12 4 8 4 4 Z"
            fill="rgb(var(--sumi))"
          />
          {/* ferrule */}
          <path d="M 13 13 L 20 20 L 24 16 L 17 9 Z" fill="rgb(var(--vermillion))" />
          {/* handle */}
          <path
            d="M 18 8 L 36 26 C 38 28 38 31 36 33 C 34 35 31 35 29 33 L 11 15 Z"
            fill="rgb(var(--sumi))"
            opacity="0.85"
          />
          <path d="M 30 20 L 36 26 C 38 28 38 31 36 33 L 27 24 Z" fill="rgb(var(--gold))" opacity="0.7" />
        </svg>
      </div>
    </>
  )
}
