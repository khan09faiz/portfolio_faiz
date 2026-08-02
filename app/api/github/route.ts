import { NextResponse } from 'next/server'
import type {
  ContributionDay,
  ContributedRepositoryNode,
  GitHubGraphQLResponse,
  LanguageStats,
  OwnedRepositoryNode,
  RepoSummary,
  GitHubStats,
} from '@/lib/types'

/** Fallback swatch for repos and languages GitHub reports no colour for. */
const DEFAULT_LANGUAGE_COLOR = '#8257e5'

// Calculate contribution streak from contribution calendar
function calculateStreaks(contributionDays: ContributionDay[]) {
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // Sort by date descending (most recent first)
  const sortedDays = [...contributionDays].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Calculate current streak (from today backwards)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (const day of sortedDays) {
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)
    
    if (dayDate <= today) {
      if (day.contributionCount > 0) {
        currentStreak++
      } else if (currentStreak > 0) {
        break // Stop counting current streak when we hit a day with no contributions
      }
    }
  }

  // Calculate longest streak
  for (const day of contributionDays) {
    if (day.contributionCount > 0) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }

  return { currentStreak, longestStreak }
}

export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'khan09faiz'

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    )
  }

  try {
    const query = `
      query GetUserStats($username: String!) {
        user(login: $username) {
          name
          bio
          avatarUrl
          followers {
            totalCount
          }
          following {
            totalCount
          }
          contributionsCollection {
            totalCommitContributions
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(
            first: 100
            privacy: PUBLIC
            ownerAffiliations: OWNER
            orderBy: {field: UPDATED_AT, direction: DESC}
          ) {
            totalCount
            nodes {
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              updatedAt
              primaryLanguage {
                name
                color
              }
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
            }
          }
          repositoriesContributedTo(
            first: 100
            privacy: PUBLIC
            contributionTypes: [COMMIT, PULL_REQUEST, ISSUE, PULL_REQUEST_REVIEW]
            orderBy: {field: UPDATED_AT, direction: DESC}
          ) {
            totalCount
            nodes {
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              updatedAt
              owner {
                login
              }
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    `

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`)
    }

    const data: GitHubGraphQLResponse = await response.json()

    if (data.errors) {
      console.error('GitHub API errors:', data.errors)
      throw new Error('GitHub API returned errors')
    }

    const userData = data.data?.user

    if (!userData) {
      throw new Error(`GitHub user "${GITHUB_USERNAME}" not found`)
    }

    // Calculate streaks from contribution calendar
    const contributionDays = userData.contributionsCollection.contributionCalendar.weeks
      .flatMap((week) => week.contributionDays)

    const { currentStreak, longestStreak } = calculateStreaks(contributionDays)

    // Calculate language statistics
    const languageMap = new Map<string, { bytes: number; color: string }>()
    let totalStars = 0
    let totalForks = 0

    userData.repositories.nodes.forEach((repo) => {
      totalStars += repo.stargazerCount
      totalForks += repo.forkCount

      if (repo.languages?.edges) {
        repo.languages.edges.forEach((edge) => {
          const color = edge.node.color ?? DEFAULT_LANGUAGE_COLOR
          const existing = languageMap.get(edge.node.name) || { bytes: 0, color }
          languageMap.set(edge.node.name, {
            bytes: existing.bytes + edge.size,
            color,
          })
        })
      }
    })

    const totalBytes = Array.from(languageMap.values()).reduce((sum, { bytes }) => sum + bytes, 0)
    
    const topLanguages: LanguageStats[] = Array.from(languageMap.entries())
      .map(([name, { bytes, color }]) => ({
        name,
        color,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100 * 10) / 10 : 0,
      }))
      .filter((lang) => lang.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8)

    // Get my repositories
    const myRepos: RepoSummary[] = userData.repositories.nodes.map((repo: OwnedRepositoryNode) => ({
      name: repo.name,
      description: repo.description || '',
      stars: repo.stargazerCount,
      forks: repo.forkCount,
      language: repo.primaryLanguage?.name || 'Unknown',
      color: repo.primaryLanguage?.color || DEFAULT_LANGUAGE_COLOR,
      url: repo.url,
      updatedAt: repo.updatedAt,
      homepage: repo.homepageUrl,
      isOwner: true,
    }))

    // Get contributed repositories (excluding own repos)
    const contributedRepos: RepoSummary[] = userData.repositoriesContributedTo.nodes
      .filter((repo: ContributedRepositoryNode) => repo.owner.login !== GITHUB_USERNAME)
      .map((repo: ContributedRepositoryNode) => ({
        name: repo.name,
        description: repo.description || '',
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        language: repo.primaryLanguage?.name || 'Unknown',
        color: repo.primaryLanguage?.color || DEFAULT_LANGUAGE_COLOR,
        url: repo.url,
        updatedAt: repo.updatedAt,
        homepage: repo.homepageUrl,
        isOwner: false,
      }))

    const stats: GitHubStats = {
      totalRepos: userData.repositories.totalCount,
      totalStars,
      totalForks,
      followers: userData.followers.totalCount,
      following: userData.following.totalCount,
      contributions: userData.contributionsCollection.contributionCalendar.totalContributions,
      currentStreak,
      longestStreak,
      languageCount: topLanguages.length,
      topLanguages,
      myRepos,
      contributedRepos,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}
