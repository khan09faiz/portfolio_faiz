/**
 * SkillsGlobe Component
 * Interactive 3D globe displaying skills as markers
 */

'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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
  delay: number
}

interface SkillsGlobeProps {
  skillsData: SkillCategory[]
}

// Particle system for ambient effects - Highly optimized
function Particles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = []
    // Reduced to 10 particles for maximum performance
    for (let i = 0; i < 10; i++) {
      const r = 3 + Math.random() * 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      temp.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state, delta) => {
    if (particlesRef.current) {
      // Very slow rotation using delta for smooth frame-independent animation
      particlesRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#4a5568"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// Rotating rings around globe - Simplified
function RotatingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    // Use delta for frame-independent animation, slower speeds
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.15
      ring1Ref.current.rotation.y += delta * 0.12
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.12
      ring2Ref.current.rotation.z += delta * 0.15
    }
  })

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.008, 8, 48]} />
        <meshBasicMaterial color="#52525B" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.2, 0.008, 8, 48]} />
        <meshBasicMaterial color="#71717A" transparent opacity={0.15} />
      </mesh>
    </>
  )
}

// Generate positions on sphere surface
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

// Skill Marker Component
function SkillMarkerPoint({ 
  position, 
  color, 
  skill, 
  category,
  delay,
  onClick 
}: { 
  position: [number, number, number]
  color: string
  skill: string
  category: string
  delay: number
  onClick: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 100)
    return () => clearTimeout(timer)
  }, [delay])

  useFrame((state, delta) => {
    if (groupRef.current && visible) {
      const scale = hovered ? 1.3 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08)
      
      // Static position - remove floating animation for performance
      groupRef.current.position.set(position[0], position[1], position[2])
      
      // Very slow rotation using delta
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  if (!visible) return null

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pulsing ring effect - simplified */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.26, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Icon Display */}
      <Html
        center
        distanceFactor={6}
        style={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hovered ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-xl backdrop-blur-md border-2 cursor-pointer transition-all duration-300"
          style={{ 
            backgroundColor: `${color}15`,
            borderColor: color,
            boxShadow: hovered 
              ? `0 0 30px ${color}90, 0 0 15px ${color}60, inset 0 0 10px ${color}30` 
              : `0 0 15px ${color}50, inset 0 0 5px ${color}20`,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))'
          }}
        >
          <TechIcon name={skill} className="h-7 w-7" />
        </div>
      </Html>
      
      {/* Glow layers - simplified */}
      <mesh>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.15}
        />
      </mesh>

      {/* Tooltip on hover */}
      {hovered && (
        <Html distanceFactor={8} position={[0, 0.6, 0]}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg px-4 py-2 shadow-2xl whitespace-nowrap pointer-events-none"
            style={{ boxShadow: `0 0 20px ${color}40` }}
          >
            <p className="text-sm font-bold text-white">{skill}</p>
            <p className="text-xs text-zinc-200">{category}</p>
          </motion.div>
        </Html>
      )}
    </group>
  )
}

// Animated Globe Component
function Globe({ markers, onMarkerClick }: { 
  markers: SkillMarker[]
  onMarkerClick: (skill: string, category: string) => void
}) {
  const globeRef = useRef<THREE.Mesh>(null)
  const wireframe1Ref = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05
    }
    
    if (wireframe1Ref.current) {
      wireframe1Ref.current.rotation.y -= delta * 0.1
    }
  })

  return (
    <>
      {/* Particles - Reduced */}
      <Particles />
      
      {/* Rotating Rings */}
      <RotatingRings />

      {/* Main Globe - Highly Optimized */}
      <Sphere ref={globeRef} args={[2.5, 24, 24]}>
        <meshStandardMaterial
          color="#18181B"
          attach="material"
          roughness={0.7}
          metalness={0.3}
          opacity={0.95}
          transparent
        />
      </Sphere>

      {/* Wireframe - Simplified */}
      <Sphere ref={wireframe1Ref} args={[2.52, 12, 12]}>
        <meshBasicMaterial
          color="#52525B"
          wireframe
          opacity={0.15}
          transparent
        />
      </Sphere>

      {/* Skill Markers */}
      {markers.map((marker, index) => (
        <SkillMarkerPoint
          key={`${marker.skill}-${index}`}
          position={marker.position}
          color={marker.color}
          skill={marker.skill}
          category={marker.category}
          delay={marker.delay}
          onClick={() => onMarkerClick(marker.skill, marker.category)}
        />
      ))}

      {/* Optimized Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#FAFAFA" />
    </>
  )
}

// Main Skills Globe Component
export function SkillsGlobe({ skillsData }: SkillsGlobeProps) {
  const [selectedSkill, setSelectedSkill] = useState<{ skill: string; category: string } | null>(null)

  // Generate markers from skills data
  const markers = useMemo(() => {
    const allMarkers: SkillMarker[] = []
    let index = 0
    
    skillsData.forEach((category) => {
      category.skills.forEach((skill) => {
        allMarkers.push({
          position: generateSpherePosition(index, skillsData.reduce((acc, cat) => acc + cat.skills.length, 0)),
          skill,
          category: category.category,
          color: category.color,
          delay: index,
        })
        index++
      })
    })
    
    return allMarkers
  }, [skillsData])

  const handleMarkerClick = (skill: string, category: string) => {
    setSelectedSkill({ skill, category })
  }

  return (
    <div className="relative w-full h-[650px] overflow-hidden">
      {/* Canvas Container */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="cursor-grab active:cursor-grabbing"
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={1}
        frameloop="demand"
      >
        <Globe markers={markers} onMarkerClick={handleMarkerClick} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.4}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Selected Skill Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-5 shadow-2xl max-w-xs"
          >
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-3 right-3 text-zinc-300 hover:text-white transition-colors"
            >
              ✕
            </button>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-2 rounded-lg bg-gray-800 border border-gray-700">
                <TechIcon name={selectedSkill.skill} className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedSkill.skill}
                </h3>
                <p className="text-sm text-zinc-200">
                  {selectedSkill.category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl p-4 max-w-xs shadow-xl"
      >
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Categories
        </h4>
        <div className="space-y-2">
          {skillsData.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              className="flex items-center gap-2 group"
            >
              <div
                className="h-3 w-3 rounded-full transition-all group-hover:scale-125 group-hover:shadow-lg"
                style={{ 
                  backgroundColor: category.color,
                  boxShadow: `0 0 8px ${category.color}80`
                }}
              />
              <span className="text-xs text-zinc-100 group-hover:text-white transition-colors">
                {category.category}
              </span>
              <span className="text-xs text-zinc-400 ml-auto group-hover:text-zinc-200 transition-colors font-mono">
                {category.skills.length}
              </span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-3 pt-3 border-t border-gray-700"
        >
          <p className="text-xs text-zinc-200">
            Total: <span className="font-bold text-white">{markers.length}</span> skills
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
