/**
 * Hero Component
 * Main hero section with animated code, rotating roles, and stats
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatCard, StatCardGrid } from '@/components/ui/StatCard'
import { 
  Github, 
  Linkedin, 
  Mail, 
  Code2, 
  Rocket, 
  GraduationCap, 
  Award,
  FileCheck,
  Download
} from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import Link from 'next/link'

// Code snippet for typing animation
const codeSnippet = `const developer = {
  name: "${SITE_CONFIG.name}",
  role: "${SITE_CONFIG.title}",
  location: "${SITE_CONFIG.person.location}",
  
  passions: [
    "Machine Learning",
    "Computer Vision", 
    "Full Stack Dev"
  ],
  
  build: async () => {
    const skills = await this.learn();
    const projects = this.create(skills);
    return this.deploy(projects);
  }
};

developer.build();`

// Rotating roles
const roles = [
  'AI/ML Engineer',
  'Full Stack Developer',
  'Problem Solver',
  'Code Enthusiast',
]

// Stats data with navigation
const stats = [
  { 
    icon: Code2, 
    value: '7+', 
    label: 'Projects', 
    color: 'text-blue-500', 
    fill: 'fill-blue-500/20',
    href: '#projects',
    description: 'View my projects'
  },
  { 
    icon: Rocket, 
    value: '60+', 
    label: 'Technologies', 
    color: 'text-purple-500', 
    fill: 'fill-purple-500/20',
    href: '#skills',
    description: 'Technical skills'
  },
  { 
    icon: FileCheck, 
    value: '5+', 
    label: 'Certificates', 
    color: 'text-cyan-500', 
    fill: 'fill-cyan-500/20',
    href: '#timeline',
    description: 'Professional certifications'
  },
  { 
    icon: GraduationCap, 
    value: 'B.Tech', 
    label: 'Degree', 
    color: 'text-green-500', 
    fill: 'fill-green-500/20',
    href: '#timeline',
    description: 'Education background'
  },
]

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  // Rotate roles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Typing animation for code
  useEffect(() => {
    if (!isTyping) return

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= codeSnippet.length) {
        setDisplayedCode(codeSnippet.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [isTyping])

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Download Resume Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              <a
                href="/resume.pdf"
                download="Mohammad_Faiz_Khan_Resume.pdf"
                className="group inline-flex items-center gap-2 text-primary text-sm sm:text-base md:text-lg font-mono bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 hover:shadow-glow-md hover:scale-105 transition-all duration-300"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
                <span>Download Resume</span>
                <span className="text-xs opacity-70">📄</span>
              </a>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4"
            >
              <span className="text-gradient drop-shadow-glow">{SITE_CONFIG.name}</span>
            </motion.h1>

            {/* Rotating Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-10 sm:h-12 md:h-16 mb-6"
            >
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentRole}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary flex items-center gap-2 sm:gap-3 justify-center lg:justify-start"
                >
                  <span className="text-lg sm:text-xl">▸</span>
                  {roles[currentRole]}
                </motion.h2>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Hey! I'm Faiz, a builder who thinks in algorithms and dreams in code. By day, I'm exploring ML and reinforcement learning. By night, debugging or diving into stock markets 📈. I love tech, competition, and figuring out how things work. Football is my daily reset. Travel sparks my best ideas.
            </motion.p>

            {/* Hala Madrid - Center aligned */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-sm sm:text-base lg:text-lg text-muted-foreground text-center mt-6"
            >
              Hala Madrid!!! ⚽
            </motion.p>
          </div>

          {/* Right Column - Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" className="overflow-hidden border-primary/20 shadow-glow-md hover:shadow-glow-xl hover:scale-105 hover:-rotate-1 transition-all duration-500 group">
              {/* Terminal Header */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer hover:bg-yellow-400 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-green-500 cursor-pointer hover:bg-green-400 transition-colors" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono ml-2">
                    ~/developer.ts
                  </span>
                </div>
                <span className="text-[10px] text-primary font-mono">
                  TypeScript
                </span>
              </div>

              {/* Code Block */}
              <pre className="text-[10px] xs:text-xs sm:text-sm font-mono max-h-[60vh] sm:max-h-none overflow-hidden">
                <code className="text-foreground/90 block break-words whitespace-pre-wrap">
                  {displayedCode}
                  {isTyping && (
                    <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-primary ml-1 animate-blink" />
                  )}
                </code>
              </pre>
            </Card>
          </motion.div>
        </div>

        {/* Stats Section - Clickable Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-16 lg:mt-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="group block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    hover 
                    className="p-6 text-center cursor-pointer transition-all duration-300 group-hover:scale-110 group-hover:border-primary/60 group-hover:shadow-glow-lg group-hover:-translate-y-1"
                  >
                    <div className={`h-12 w-12 rounded-full ${stat.color.replace('text-', 'bg-')}/20 flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-125 group-hover:${stat.color.replace('text-', 'bg-')}/40 group-hover:rotate-12`}>
                      <stat.icon className={`h-6 w-6 ${stat.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-[360deg]`} />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mb-1 group-hover:text-primary transition-all duration-300 group-hover:scale-110">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                      {stat.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground/50 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                      Click to view
                    </div>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
