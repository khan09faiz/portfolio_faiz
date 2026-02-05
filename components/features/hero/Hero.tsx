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
  Users, 
  Award 
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

// Stats data
const stats = [
  { icon: Code2, value: '7+', label: 'Projects', color: 'text-blue-500', fill: 'fill-blue-500/20' },
  { icon: Rocket, value: '60+', label: 'Technologies', color: 'text-purple-500', fill: 'fill-purple-500/20' },
  { icon: Users, value: '10K+', label: 'Impact', color: 'text-green-500', fill: 'fill-green-500/20' },
  { icon: Award, value: '3+', label: 'Achievements', color: 'text-orange-500', fill: 'fill-orange-500/20' },
]

// Highlights
const highlights = [
  {
    title: 'AI/ML Expertise',
    description: 'Deep learning, computer vision, and NLP with TensorFlow & PyTorch',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Full Stack Development',
    description: 'Modern web apps with React, Next.js, Node.js, and PostgreSQL',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    title: 'Production Ready',
    description: 'Scalable solutions with Docker, AWS, and CI/CD pipelines',
    gradient: 'from-green-500/20 to-emerald-500/20',
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary text-sm sm:text-base md:text-lg font-mono">
                {'<'} Hello World {'/>'} 👋
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              <span className="text-gradient">{SITE_CONFIG.name}</span>
            </motion.h1>

            {/* Rotating Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-10 sm:h-12 md:h-16"
            >
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentRole}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary"
                >
                  {roles[currentRole]}
                </motion.h2>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Hey! I'm Faiz, a builder who thinks in algorithms and dreams in code. By day, I'm exploring ML and reinforcement learning. By night, debugging or diving into stock markets 📈. I love tech, competition, and figuring out how things work. Football is my daily reset. Travel sparks my best ideas.
              <br /><br />
              Hala Madrid!!! ⚽️
            </motion.p>
          </div>

          {/* Right Column - Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card variant="elevated" className="overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  ~/developer.ts
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

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 lg:mt-20 grid md:grid-cols-3 gap-6"
        >
          {highlights.map((highlight, index) => (
            <Card
              key={highlight.title}
              hover
              className={`bg-gradient-to-br ${highlight.gradient} backdrop-blur-md`}
            >
              <h3 className="text-lg font-bold mb-2 text-foreground">
                {highlight.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {highlight.description}
              </p>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
