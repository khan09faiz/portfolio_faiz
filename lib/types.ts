/**
 * Global TypeScript type definitions for the portfolio
 */

// ============================================================================
// Project Types
// ============================================================================

export interface Project {
  id: string
  title: string
  description: string // Short description for cards
  longDescription?: string // Detailed description for modal
  category: 'AI/ML' | 'Frontend' | 'Backend' | 'Full-Stack'
  featured: boolean
  technologies: string[]
  links?: {
    github?: string
    live?: string
  }
  date: string // ISO date format
  images?: string[]
  keyFeatures?: string[]
  impact?: Array<{
    label: string
    value: string
  }>
}

// ============================================================================
// Skills Types
// ============================================================================

export interface SkillCategory {
  category: string
  proficiency: number // 0-100
  color: string // Hex color
  skills: string[]
}

// ============================================================================
// Timeline Types
// ============================================================================

export interface TimelineItem {
  id: string
  type: 'work' | 'education' | 'achievement'
  title: string
  organization: string
  location: string
  startDate: string // YYYY-MM format
  endDate?: string // YYYY-MM format or undefined for current
  description?: string[]
  technologies?: string[]
  icon?: string
}

// ============================================================================
// GitHub API Types
// ============================================================================

// --- Wire types: these mirror the GraphQL query in app/api/github/route.ts ---
// Only fields the query actually selects appear here. Adding a field to the
// query means adding it here too.

export interface Language {
  name: string
  color: string | null
}

export interface LanguageEdge {
  size: number
  node: Language
}

export interface ContributionDay {
  contributionCount: number
  date: string
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionWeek[]
}

export interface ContributionsCollection {
  totalCommitContributions: number
  contributionCalendar: ContributionCalendar
}

/** A repository node from the `repositories` connection. */
export interface OwnedRepositoryNode {
  name: string
  description: string | null
  url: string
  homepageUrl: string | null
  stargazerCount: number
  forkCount: number
  updatedAt: string
  primaryLanguage: Language | null
  languages: { edges: LanguageEdge[] } | null
}

/** A repository node from the `repositoriesContributedTo` connection. */
export interface ContributedRepositoryNode {
  name: string
  description: string | null
  url: string
  homepageUrl: string | null
  stargazerCount: number
  forkCount: number
  updatedAt: string
  owner: { login: string }
  primaryLanguage: Language | null
}

export interface GitHubGraphQLUser {
  name: string
  bio: string
  avatarUrl: string
  followers: { totalCount: number }
  following: { totalCount: number }
  contributionsCollection: ContributionsCollection
  repositories: {
    totalCount: number
    nodes: OwnedRepositoryNode[]
  }
  repositoriesContributedTo: {
    totalCount: number
    nodes: ContributedRepositoryNode[]
  }
}

export interface GitHubGraphQLResponse {
  data?: { user: GitHubGraphQLUser | null }
  errors?: Array<{ message: string }>
}

// --- Response types: the flattened shape /api/github returns to the client ---

export interface LanguageStats {
  name: string
  color: string
  percentage: number
}

/** A repository as exposed by /api/github — flattened for direct rendering. */
export interface RepoSummary {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  color: string
  url: string
  updatedAt: string
  homepage?: string | null
  isOwner: boolean
}

export interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  followers: number
  following: number
  contributions: number
  currentStreak: number
  longestStreak: number
  languageCount: number
  topLanguages: LanguageStats[]
  myRepos: RepoSummary[]
  contributedRepos: RepoSummary[]
}

// ============================================================================
// Experience Types
// ============================================================================

export interface Achievement {
  description: string
  metric?: string
}

export interface Experience {
  company: string
  role: string
  duration: string
  location: string
  type: 'Internship' | 'Full-time' | 'Contract'
  responsibilities: string[]
  achievements: Achievement[]
  techStack: string[]
  logo?: string
}

// ============================================================================
// Contact Form Types
// ============================================================================

export interface ContactFormData {
  name: string
  email: string
  message: string
}

// ============================================================================
// Error Types
// ============================================================================

export class RateLimitError extends Error {
  resetTime: string

  constructor(resetTime: string) {
    super('GitHub API rate limit exceeded')
    this.name = 'RateLimitError'
    this.resetTime = resetTime
  }
}

export class GitHubAPIError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'GitHubAPIError'
    this.statusCode = statusCode
  }
}

// ============================================================================
// UI Types
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

export type GlassCardVariant = 'default' | 'elevated' | 'flat' | 'outlined'

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant
  hoverable?: boolean
}
