/**
 * AnimatedBackground Component
 * Floating geometric shapes with subtle animations
 */

'use client'

import { useEffect, useRef } from 'react'

interface Shape {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  type: 'circle' | 'triangle' | 'square' | 'hexagon'
  opacity: number
  color: string
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Geometric shapes colors (subtle grays/whites)
    const colors = [
      'rgba(212, 212, 216, 0.15)',
      'rgba(228, 228, 231, 0.12)',
      'rgba(244, 244, 245, 0.1)',
      'rgba(161, 161, 170, 0.18)',
    ]

    const shapes: Shape[] = []
    const shapeTypes: Shape['type'][] = ['circle', 'triangle', 'square', 'hexagon']
    
    // Create floating shapes - Reduced to 5 for better performance
    for (let i = 0; i < 5; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 40 + 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Draw functions for different shapes
    const drawCircle = (shape: Shape) => {
      ctx.beginPath()
      ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2)
      ctx.strokeStyle = shape.color
      ctx.lineWidth = 2
      ctx.stroke()
    }

    const drawTriangle = (shape: Shape) => {
      ctx.save()
      ctx.translate(shape.x, shape.y)
      ctx.rotate(shape.rotation)
      ctx.beginPath()
      ctx.moveTo(0, -shape.size)
      ctx.lineTo(shape.size * 0.866, shape.size * 0.5)
      ctx.lineTo(-shape.size * 0.866, shape.size * 0.5)
      ctx.closePath()
      ctx.strokeStyle = shape.color
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
    }

    const drawSquare = (shape: Shape) => {
      ctx.save()
      ctx.translate(shape.x, shape.y)
      ctx.rotate(shape.rotation)
      ctx.strokeStyle = shape.color
      ctx.lineWidth = 2
      ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
      ctx.restore()
    }

    const drawHexagon = (shape: Shape) => {
      ctx.save()
      ctx.translate(shape.x, shape.y)
      ctx.rotate(shape.rotation)
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const x = shape.size * Math.cos(angle)
        const y = shape.size * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = shape.color
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()
    }

    // Animation loop with performance optimization
    let animationId: number
    let lastFrameTime = 0
    const frameInterval = 1000 / 24 // Target 24 FPS for background (even less demanding)
    
    const animate = (currentTime: number) => {
      // Throttle to 24 FPS for background
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw shapes
      shapes.forEach((shape) => {
        // Update position
        shape.x += shape.vx
        shape.y += shape.vy
        shape.rotation += shape.rotationSpeed

        // Wrap around for smoother experience
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size

        // Draw based on type
        switch (shape.type) {
          case 'circle':
            drawCircle(shape)
            break
          case 'triangle':
            drawTriangle(shape)
            break
          case 'square':
            drawSquare(shape)
            break
          case 'hexagon':
            drawHexagon(shape)
            break
        }
      })

      // Simplified connecting lines - only draw if shapes are very close
      ctx.strokeStyle = 'rgba(212, 212, 216, 0.04)'
      ctx.lineWidth = 1
      const maxDistance = 200
      for (let i = 0; i < shapes.length - 1; i++) {
        for (let j = i + 1; j < shapes.length; j++) {
          const dx = shapes[i].x - shapes[j].x
          const dy = shapes[i].y - shapes[j].y
          
          // Quick distance check before drawing
          const distSq = dx * dx + dy * dy
          if (distSq < maxDistance * maxDistance) {
            ctx.beginPath()
            ctx.moveTo(shapes[i].x, shapes[i].y)
            ctx.lineTo(shapes[j].x, shapes[j].y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen', willChange: 'contents' }}
    />
  )
}
