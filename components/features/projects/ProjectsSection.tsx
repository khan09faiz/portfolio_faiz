/**
 * ProjectsSection Component
 * Main projects showcase with filtering
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { Project } from '@/lib/types'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'
import projectsDataRaw from '@/src/data/projects.json'

const projectsData = projectsDataRaw as Project[]
const categories = ['All', 'AI/ML', 'Frontend', 'Backend', 'Full-Stack']

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter projects
  const filteredProjects = projectsData.filter((project) => {
    if (selectedCategory === 'All') return true
    return project.category === selectedCategory
  })

  // Sort: featured first, then by date
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Get category counts
  const categoryCounts = categories.reduce((acc, category) => {
    if (category === 'All') {
      acc[category] = projectsData.length
    } else {
      acc[category] = projectsData.filter((p) => p.category === category).length
    }
    return acc
  }, {} as Record<string, number>)

  // Modal navigation
  const handleOpenModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }

  const handleNext = () => {
    if (!selectedProject) return
    const currentIndex = sortedProjects.findIndex((p) => p.id === selectedProject.id)
    const nextIndex = (currentIndex + 1) % sortedProjects.length
    setSelectedProject(sortedProjects[nextIndex])
  }

  const handlePrevious = () => {
    if (!selectedProject) return
    const currentIndex = sortedProjects.findIndex((p) => p.id === selectedProject.id)
    const previousIndex = (currentIndex - 1 + sortedProjects.length) % sortedProjects.length
    setSelectedProject(sortedProjects[previousIndex])
  }

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        {/* Header */}
        <SectionHeader
          terminalPath="~/projects"
          title="Featured Projects"
          description="A collection of projects showcasing AI/ML expertise and full-stack development skills"
        />

        {/* Filter Buttons */}
        <FilterButtonGroup className="mt-8 mb-12">
          {categories.map((category) => (
            <FilterButton
              key={category}
              label={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              count={categoryCounts[category]}
            />
          ))}
        </FilterButtonGroup>

        {/* Projects Grid */}
        {sortedProjects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleOpenModal(project)}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Code2 className="w-10 h-10 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              No projects found in this category
            </p>
            <p className="text-sm text-muted-foreground/60">
              Try selecting a different filter
            </p>
          </div>
        )}

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onNext={sortedProjects.length > 1 ? handleNext : undefined}
          onPrevious={sortedProjects.length > 1 ? handlePrevious : undefined}
        />
      </div>
    </section>
  )
}
