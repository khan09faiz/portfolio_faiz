/**
 * AnimatedBackground
 * Samurai atmosphere: drifting fog banks with falling sakura petals.
 *
 * Replaces the previous floating-geometry canvas. Same single fixed canvas and
 * the same compositing, so this costs no extra layer.
 *
 * Motion budget (docs/19_ANIMATIONS.md):
 *  - fog blobs are rendered ONCE into offscreen canvases and then only blitted,
 *    so no per-frame gradient construction
 *  - the loop is throttled to 30fps and stops entirely when the tab is hidden
 *  - particle counts scale down on small viewports
 *  - prefers-reduced-motion paints a single static frame and never starts a loop
 */

'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

type Rgb = [number, number, number]

interface FogBank {
  sprite: HTMLCanvasElement
  x: number
  y: number
  vx: number
  size: number
}

interface Petal {
  x: number
  y: number
  vy: number
  drift: number
  phase: number
  size: number
  rotation: number
  spin: number
  alpha: number
}

/** Reads a `--token` holding a space-separated RGB triplet. */
function readToken(name: string, fallback: Rgb): Rgb {
  if (typeof window === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const parts = raw
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n))
  return parts.length === 3 ? (parts as Rgb) : fallback
}

/** Pre-renders one soft radial blob so the animation loop only has to blit it. */
function makeFogSprite(size: number, [r, g, b]: Rgb, alpha: number): HTMLCanvasElement {
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const sctx = sprite.getContext('2d')
  if (!sctx) return sprite

  const half = size / 2
  const gradient = sctx.createRadialGradient(half, half, 0, half, half, half)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
  gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`)
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
  sctx.fillStyle = gradient
  sctx.fillRect(0, 0, size, size)
  return sprite
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal, [r, g, b]: Rgb) {
  const { size } = petal
  ctx.save()
  ctx.translate(petal.x, petal.y)
  ctx.rotate(petal.rotation)
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${petal.alpha})`
  ctx.beginPath()
  // Teardrop petal: two curves meeting at the tip.
  ctx.moveTo(0, -size)
  ctx.quadraticCurveTo(size * 0.85, -size * 0.25, 0, size)
  ctx.quadraticCurveTo(-size * 0.85, -size * 0.25, 0, -size)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let fog: FogBank[] = []
    let petals: Petal[] = []

    // Palette is read from the CSS tokens, so the scene follows the
    // restrained/bold switch without this component knowing about it.
    let vermillion = readToken('--vermillion', [191, 42, 34])
    let sakuraColor = readToken('--sakura', [233, 168, 185])
    let sumi = readToken('--sumi', [26, 24, 22])

    const isSmall = () => window.innerWidth < 768

    function buildScene() {
      const fogCount = isSmall() ? 3 : 5
      const petalCount = isSmall() ? 8 : 18

      fog = Array.from({ length: fogCount }, (_, i) => {
        // Alternating banks: sumi ink haze and a faint vermillion tint. Alphas
        // are low because dark fog on pale paper carries much further than the
        // same value did on the old dark ground.
        const tinted = i % 2 === 0
        const tint = tinted ? vermillion : sumi
        const size = Math.round(Math.max(width, height) * (tinted ? 0.7 : 0.55))
        return {
          sprite: makeFogSprite(size, tint, tinted ? 0.06 : 0.045),
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          size,
        }
      })

      petals = Array.from({ length: petalCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: 0.25 + Math.random() * 0.5,
        drift: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        size: 3 + Math.random() * 4,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        alpha: 0.25 + Math.random() * 0.35,
      }))
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildScene()
    }

    function paint(time: number) {
      ctx!.clearRect(0, 0, width, height)

      for (const bank of fog) {
        ctx!.drawImage(bank.sprite, bank.x - bank.size / 2, bank.y - bank.size / 2)
      }

      for (const petal of petals) {
        drawPetal(ctx!, petal, sakuraColor)
      }

      // Silence the unused-arg lint in the static path.
      void time
    }

    function step(dt: number, time: number) {
      for (const bank of fog) {
        bank.x += bank.vx * dt
        if (bank.x < -bank.size) bank.x = width + bank.size
        if (bank.x > width + bank.size) bank.x = -bank.size
      }

      for (const petal of petals) {
        petal.y += petal.vy * dt
        // Sway: petals fall in a lazy sine rather than straight down.
        petal.x += Math.sin(time * 0.0006 + petal.phase) * petal.drift * dt * 0.35
        petal.rotation += petal.spin * dt

        if (petal.y > height + 12) {
          petal.y = -12
          petal.x = Math.random() * width
        }
        if (petal.x > width + 12) petal.x = -12
        if (petal.x < -12) petal.x = width + 12
      }
    }

    resize()
    window.addEventListener('resize', resize)

    // Re-read tokens when the crimson intensity is switched.
    const observer = new MutationObserver(() => {
      vermillion = readToken('--vermillion', vermillion)
      sakuraColor = readToken('--sakura', sakuraColor)
      sumi = readToken('--sumi', sumi)
      buildScene()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ink'],
    })

    // Reduced motion: one static frame, no loop, no listeners beyond resize.
    if (prefersReducedMotion) {
      paint(0)
      return () => {
        window.removeEventListener('resize', resize)
        observer.disconnect()
      }
    }

    let frame = 0
    let lastTime = 0
    let lastStep = 0
    const frameInterval = 1000 / 30

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop)
      if (time - lastTime < frameInterval) return

      // Delta in ~16ms units, clamped so a backgrounded tab cannot produce a
      // single enormous jump when it resumes.
      const dt = lastStep ? Math.min((time - lastStep) / 16.67, 3) : 1
      lastStep = time
      lastTime = time

      step(dt, time)
      paint(time)
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else if (!frame) {
        lastStep = 0
        frame = requestAnimationFrame(loop)
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      observer.disconnect()
    }
  }, [prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: 'contents' }}
    />
  )
}
