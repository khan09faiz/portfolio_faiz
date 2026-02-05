/**
 * SkillsGlobe Component
 * Optimized 3D globe displaying skills as simple colored markers
 * Uses pure Three.js meshes instead of DOM overlays for maximum performance
 */

'use client'

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { SkillCategory } from '@/lib/types'
import TechIcon from '@/components/ui/TechIcon'

interface SkillMarker {
  position: [number, number, number]
  skill: string
  category: string
  color: string
}

interface SkillsGlobeProps {
  skillsData: SkillCategory[]
}

// Generate positions on sphere surface using fibonacci sphere
function generateSpherePosition(index: number, total: number): [number, number, number] {
  const phi = Math.acos(-1 + (2 * index) / total)
  const theta = Math.sqrt(total * Math.PI) * phi
  const radius = 2.5

  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi),
  ]
}

// Skill marker with icon - minimal Html, no extra effects
function MarkerDot({
  position,
  color,
  skill,
  onClick,
}: {
  position: [number, number, number]
  color: string
  skill: string
  onClick: () => void
}) {
  return (
    <group position={position}>
      <Html
        center
        distanceFactor={6}
        style={{ pointerEvents: 'auto' }}
        zIndexRange={[1, 0]}
      >
        <div
          onClick={onClick}
          className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
          style={{
            backgroundColor: `${color}20`,
            border: `1.5px solid ${color}`,
          }}
        >
          <TechIcon name={skill} className="h-5 w-5" />
        </div>
      </Html>
    </group>
  )
}

// Globe scene - single useFrame for all animations
function GlobeScene({
  markers,
  onMarkerClick,
  isMobile,
}: {
  markers: SkillMarker[]
  onMarkerClick: (skill: string, category: string) => void
  isMobile: boolean
}) {
  const globeRef = useRef<THREE.Mesh>(null)
  const markersGroupRef = useRef<THREE.Group>(null)

  // Single useFrame for the entire scene
  useFrame((_, delta) => {
    const speed = delta * 0.08
    if (globeRef.current) {
      globeRef.current.rotation.y += speed
    }
    if (markersGroupRef.current) {
      markersGroupRef.current.rotation.y += speed
    }
  })

  const segments = isMobile ? 16 : 24

  return (
    <>
      {/* Globe */}
      <Sphere ref={globeRef} args={[2.5, segments, segments]}>
        <meshBasicMaterial
          color="#18181B"
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Wireframe overlay - desktop only */}
      {!isMobile && (
        <Sphere args={[2.52, 12, 12]}>
          <meshBasicMaterial
            color="#3f3f46"
            wireframe
            transparent
            opacity={0.12}
          />
        </Sphere>
      )}

      {/* All markers in a single group */}
      <group ref={markersGroupRef}>
        {markers.map((marker, i) => (
          <MarkerDot
            key={`${marker.skill}-${i}`}
            position={marker.position}
            color={marker.color}
            skill={marker.skill}
            onClick={() => onMarkerClick(marker.skill, marker.category)}
          />
        ))}
      </group>

      {/* Minimal lighting */}
      <ambientLight intensity={0.8} />
    </>
  )
}

// Main export
export function SkillsGlobe({ skillsData }: SkillsGlobeProps) {
  const [selectedSkill, setSelectedSkill] = useState<{
    skill: string
    category: string
  } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const markers = useMemo(() => {
    const all: SkillMarker[] = []
    let idx = 0
    const total = skillsData.reduce((a, c) => a + c.skills.length, 0)

    skillsData.forEach((category) => {
      category.skills.forEach((skill) => {
        all.push({
          position: generateSpherePosition(idx, total),
          skill,
          category: category.category,
          color: category.color,
        })
        idx++
      })
    })

    // Show every 3rd marker on mobile
    if (isMobile) return all.filter((_, i) => i % 3 === 0)
    return all
  }, [skillsData, isMobile])

  const handleMarkerClick = useCallback((skill: string, category: string) => {
    setSelectedSkill({ skill, category })
  }, [])

  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        className="cursor-grab active:cursor-grabbing"
        style={{ background: 'transparent', touchAction: 'pan-y' }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={1}
        frameloop="always"
      >
        <GlobeScene
          markers={markers}
          onMarkerClick={handleMarkerClick}
          isMobile={isMobile}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.5}
          enableDamping={false}
        />
      </Canvas>

      {/* Selected Skill Info */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3"
          >
            <div className="p-1.5 rounded-lg bg-gray-800 border border-gray-700">
              <TechIcon
                name={selectedSkill.skill}
                className="h-6 w-6 sm:h-7 sm:w-7"
              />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white">
                {selectedSkill.skill}
              </p>
              <p className="text-xs text-zinc-300">{selectedSkill.category}</p>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className="ml-2 text-zinc-400 hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend - md+ only */}
      <div className="hidden md:block absolute top-3 right-3 bg-gray-900/85 border border-gray-700 rounded-xl p-3 shadow-xl">
        <h4 className="text-xs font-bold text-white mb-2">Categories</h4>
        <div className="space-y-1.5">
          {skillsData.map((category) => (
            <div key={category.category} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-[11px] text-zinc-200">
                {category.category}
              </span>
              <span className="text-[11px] text-zinc-500 ml-auto font-mono">
                {category.skills.length}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className="text-[11px] text-zinc-300">
            Total:{' '}
            <span className="font-bold text-white">{markers.length}</span>{' '}
            skills
          </p>
        </div>
      </div>
    </div>
  )
}
