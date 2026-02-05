/**
 * GitHub Stats Section
 * Displays GitHub profile statistics and contributions
 */

'use client'

import { useEffect, useState } from 'react'
import { Github, GitFork, Star, Users, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SITE_CONFIG } from '@/lib/constants'

interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  followers: number
  following: number
  contributions: number
  topLanguages: Array<{
    name: string
    percentage: number
    color: string
  }>
  featuredRepos: Array<{
    name: string
    description: string
    stars: number
    forks: number
    language: string
    color: string
    url: string
  }>
}

const fallbackData: GitHubStats = {
  totalRepos: 24,
  totalStars: 45,
  totalForks: 12,
  followers: 38,
  following: 52,
  contributions: 847,
  topLanguages: [
    { name: 'Python', percentage: 42.5, color: '#3572A5' },
    { name: 'TypeScript', percentage: 28.3, color: '#2b7489' },
    { name: 'JavaScript', percentage: 18.2, color: '#f1e05a' },
    { name: 'CSS', percentage: 6.8, color: '#563d7c' },
    { name: 'HTML', percentage: 4.2, color: '#e34c26' },
  ],
  featuredRepos: [
    {
      name: 'Idea-Recommendation-model',
      description: 'GIG - Multi-factor ranking system with blockchain validation and federated learning',
      stars: 12,
      forks: 3,
      language: 'Python',
      color: '#3572A5',
      url: 'https://github.com/khan09faiz/Idea-Recommendation-model-',
    },
    {
      name: 'Unified-stock-market',
      description: 'SARIMA-GARCH hybrid model with FinBERT sentiment and PPO reinforcement learning',
      stars: 8,
      forks: 2,
      language: 'Python',
      color: '#3572A5',
      url: 'https://github.com/khan09faiz/Unified-stock-market',
    },
    {
      name: 'blind-cap-object-detection',
      description: 'YOLOv8-based accessibility wearable with real-time object detection',
      stars: 15,
      forks: 4,
      language: 'Python',
      color: '#3572A5',
      url: 'https://github.com/khan09faiz/blind-cap-object-detection',
    },
    {
      name: 'Me-myself-I',
      description: 'Personal portfolio built with Next.js, TypeScript, and Tailwind CSS',
      stars: 5,
      forks: 1,
      language: 'TypeScript',
      color: '#2b7489',
      url: 'https://github.com/khan09faiz/Me-myself-I',
    },
  ],
}

export function GitHubSection() {
  const [stats, setStats] = useState<GitHubStats>(fallbackData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/github')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching GitHub stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <section id="github" className="section-padding">
      <div className="container">
        <SectionHeader
          terminalPath="~/github"
          title="GitHub Statistics"
          description="My coding journey, contributions, and open source work"
        />

        {/* Visit GitHub Button */}
        <div className="flex justify-center mb-12">
          <a
            href={SITE_CONFIG.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
          >
            <Github className="h-6 w-6" />
            <span className="text-lg">Visit GitHub Profile</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          <Card className="p-6 text-center">
            <Github className="h-8 w-8 mx-auto mb-3 text-primary" />
            <div className="text-3xl font-bold mb-1">{stats.totalRepos}</div>
            <div className="text-sm text-muted-foreground">Repositories</div>
          </Card>

          <Card className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
            <div className="text-3xl font-bold mb-1">{stats.totalStars}</div>
            <div className="text-sm text-muted-foreground">Stars Earned</div>
          </Card>

          <Card className="p-6 text-center">
            <GitFork className="h-8 w-8 mx-auto mb-3 text-green-500" />
            <div className="text-3xl font-bold mb-1">{stats.totalForks}</div>
            <div className="text-sm text-muted-foreground">Forks</div>
          </Card>

          <Card className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-blue-500" />
            <div className="text-3xl font-bold mb-1">{stats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </Card>

          <Card className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-3 text-purple-500" />
            <div className="text-3xl font-bold mb-1">{stats.following}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </Card>

          <Card className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-orange-500" />
            <div className="text-3xl font-bold mb-1">{stats.contributions}</div>
            <div className="text-sm text-muted-foreground">Contributions</div>
          </Card>
        </div>

        {/* Top Languages */}
        <Card className="p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6">
            <span className="text-gradient">Top Languages</span>
          </h3>
          <div className="space-y-4">
            {stats.topLanguages.map((lang) => (
              <div key={lang.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-muted-foreground">{lang.percentage}%</span>
                </div>
                <div className="h-3 bg-card/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Featured Repositories */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            <span className="text-gradient">Featured Repositories</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {stats.featuredRepos.map((repo) => (
              <Card key={repo.name} className="p-6 hover:border-primary/30 transition-all duration-300">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-bold text-primary hover:underline">
                      {repo.name}
                    </h4>
                    <Github className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: repo.color }}
                      />
                      <span>{repo.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{repo.forks}</span>
                    </div>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
