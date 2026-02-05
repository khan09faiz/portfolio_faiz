/**
 * GitHub Stats Section
 * Displays GitHub profile statistics and contributions
 */

'use client'

import { useEffect, useState } from 'react'
import { Github, GitFork, Star, Code2, Flame, Award, Monitor, ExternalLink, GitBranch, Clock, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SITE_CONFIG } from '@/lib/constants'

interface Repository {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  color: string
  url: string
  updatedAt: string
  homepage?: string
  isOwner: boolean
}

interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  followers: number
  following: number
  contributions: number
  currentStreak: number
  longestStreak: number
  languageCount: number
  topLanguages: Array<{
    name: string
    percentage: number
    color: string
  }>
  myRepos: Repository[]
  contributedRepos: Repository[]
}

const fallbackData: GitHubStats = {
  totalRepos: 10,
  totalStars: 1,
  totalForks: 0,
  followers: 0,
  following: 0,
  contributions: 415,
  currentStreak: 5,
  longestStreak: 9,
  languageCount: 5,
  topLanguages: [
    { name: 'Python', percentage: 42.5, color: '#3572A5' },
    { name: 'TypeScript', percentage: 28.3, color: '#2b7489' },
    { name: 'JavaScript', percentage: 18.2, color: '#f1e05a' },
  ],
  myRepos: [],
  contributedRepos: [],
}

export function GitHubSection() {
  const [stats, setStats] = useState<GitHubStats>(fallbackData)
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All')
  const [selectedContribLang, setSelectedContribLang] = useState<string>('All')
  const [showAllRepos, setShowAllRepos] = useState(false)
  const [showAllContrib, setShowAllContrib] = useState(false)

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

  // Get unique languages from my repos
  const myRepoLanguages = ['All', ...Array.from(new Set(stats.myRepos.map(r => r.language))).filter(Boolean)]
  
  // Get unique languages from contributed repos
  const contribLanguages = ['All', ...Array.from(new Set(stats.contributedRepos.map(r => r.language))).filter(Boolean)]

  // Filter repositories
  const filteredMyRepos = selectedLanguage === 'All' 
    ? stats.myRepos 
    : stats.myRepos.filter(r => r.language === selectedLanguage)
  
  const filteredContribRepos = selectedContribLang === 'All'
    ? stats.contributedRepos
    : stats.contributedRepos.filter(r => r.language === selectedContribLang)

  // Show initial 6 repos or all
  const displayedMyRepos = showAllRepos ? filteredMyRepos : filteredMyRepos.slice(0, 6)
  const displayedContribRepos = showAllContrib ? filteredContribRepos : filteredContribRepos.slice(0, 6)

  const hasMoreMyRepos = filteredMyRepos.length > 6
  const hasMoreContrib = filteredContribRepos.length > 6

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`
    return `${Math.floor(seconds / 2592000)} months ago`
  }

  return (
    <section id="github" className="section-padding bg-gradient-to-b from-background to-background/50">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <span className="text-sm font-mono">~/github</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Open Source Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real-time statistics from my <span className="text-primary font-semibold">GitHub profile</span> showcasing{' '}
            <span className="text-primary font-semibold">{stats.totalRepos} repositories</span>,{' '}
            <span className="text-primary font-semibold">{stats.totalStars} stars earned</span>, and contributions across{' '}
            <span className="text-primary font-semibold">{stats.languageCount}+ programming languages</span>. Each project demonstrates consistent development practices and code quality standards.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        >
          <Card className="p-6 text-center hover:border-primary/30 transition-all">
            <div className="h-12 w-12 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-3">
              <GitBranch className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalRepos}</div>
            <div className="text-sm text-muted-foreground">Repositories</div>
          </Card>

          <Card className="p-6 text-center hover:border-primary/30 transition-all">
            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalStars}</div>
            <div className="text-sm text-muted-foreground">Total Stars</div>
          </Card>

          <Card className="p-6 text-center hover:border-primary/30 transition-all">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <Code2 className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.languageCount}+</div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </Card>

          <Card className="p-6 text-center hover:border-primary/30 transition-all">
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <GitBranch className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.contributions}</div>
            <div className="text-sm text-muted-foreground">Contributions</div>
          </Card>

          <Card className="p-6 text-center hover:border-primary/30 transition-all">
            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>

          <Card className="p-6 text-center hover:border-primary/30 transition-all">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </Card>
        </motion.div>

        {/* Mobile Desktop Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:hidden mb-12"
        >
          <Card className="p-8 text-center bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">View Detailed Statistics on Desktop</h3>
            <p className="text-muted-foreground mb-6">
              For the best experience viewing my contribution heatmap and detailed language statistics, please visit on a larger screen or check out my GitHub profile directly.
            </p>
            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-card/80 border border-primary/20 rounded-lg transition-all"
            >
              <Github className="h-5 w-5" />
              Visit GitHub Profile
              <ExternalLink className="h-4 w-4" />
            </a>
          </Card>
        </motion.div>

        {/* My Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-3xl font-bold">My Repositories</h3>
          </div>

          {/* Language Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {myRepoLanguages.map((lang) => {
              const count = lang === 'All' 
                ? stats.myRepos.length 
                : stats.myRepos.filter(r => r.language === lang).length
              
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedLanguage === lang
                      ? 'bg-primary text-white'
                      : 'bg-card hover:bg-card/80 text-muted-foreground hover:text-foreground border border-primary/10'
                  }`}
                >
                  {lang} <span className="opacity-60">({count})</span>
                </button>
              )
            })}
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Showing <span className="text-foreground font-medium">{filteredMyRepos.length}</span> repositories
          </p>

          {/* Repository Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {displayedMyRepos.map((repo, index) => (
              <motion.div
                key={repo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col hover:border-primary/30 transition-all group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Github className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                          {SITE_CONFIG.githubUsername}
                        </h4>
                        {repo.homepage && (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-500 flex-shrink-0">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-semibold">{repo.name}</p>
                    </div>
                  </div>

                  {repo.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: repo.color }} />
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{repo.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{repo.forks}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="h-3 w-3" />
                    <span>Updated {formatTimeAgo(repo.updatedAt)}</span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-card hover:bg-primary/10 border border-primary/20 rounded-lg text-center text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-center text-sm font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live
                      </a>
                    )}
                  </div>

                  {repo.language && (
                    <div className="mt-3 pt-3 border-t border-primary/10 text-xs text-muted-foreground italic">
                      // Built with {repo.language}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View More Button */}
          {hasMoreMyRepos && !showAllRepos && (
            <div className="text-center">
              <button
                onClick={() => setShowAllRepos(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-primary/10 border border-primary/20 rounded-lg transition-all"
              >
                <ChevronDown className="h-5 w-5" />
                View {filteredMyRepos.length - 6} More
              </button>
            </div>
          )}
        </motion.div>

        {/* Open Source Contributions */}
        {stats.contributedRepos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <GitBranch className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold">Open Source Contributions</h3>
            </div>

            <p className="text-muted-foreground mb-6">
              {stats.contributedRepos.length} repositories across GitHub — Active participation in open source community
            </p>

            {/* Language Filter for Contributions */}
            <div className="flex flex-wrap gap-2 mb-6">
              {contribLanguages.map((lang) => {
                const count = lang === 'All'
                  ? stats.contributedRepos.length
                  : stats.contributedRepos.filter(r => r.language === lang).length

                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedContribLang(lang)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedContribLang === lang
                        ? 'bg-primary text-white'
                        : 'bg-card hover:bg-card/80 text-muted-foreground hover:text-foreground border border-primary/10'
                    }`}
                  >
                    {lang} <span className="opacity-60">({count})</span>
                  </button>
                )
              })}
            </div>

            {/* Contribution Repository Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {displayedContribRepos.map((repo, index) => (
                <motion.div
                  key={repo.url}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full flex flex-col hover:border-green-500/30 transition-all group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Github className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg truncate group-hover:text-green-500 transition-colors mb-1">
                          {repo.url.split('/')[3]}
                        </h4>
                        <p className="text-green-500 font-semibold truncate">{repo.name}</p>
                      </div>
                    </div>

                    {repo.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {repo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {repo.language && (
                        <div className="flex items-center gap-1.5">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: repo.color }} />
                          <span>{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forks}</span>
                      </div>
                    </div>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto px-4 py-2 bg-card hover:bg-green-500/10 border border-green-500/20 rounded-lg text-center text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Repository
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* View More Button for Contributions */}
            {hasMoreContrib && !showAllContrib && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllContrib(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card hover:bg-green-500/10 border border-green-500/20 rounded-lg transition-all"
                >
                  <ChevronDown className="h-5 w-5" />
                  View {filteredContribRepos.length - 6} More
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}