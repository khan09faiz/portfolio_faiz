import { NextResponse } from 'next/server'

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
              stargazerCount
              forkCount
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

    const data = await response.json()

    if (data.errors) {
      console.error('GitHub API errors:', data.errors)
      throw new Error('GitHub API returned errors')
    }

    // Calculate language statistics
    const languageMap = new Map<string, { bytes: number; color: string }>()
    let totalStars = 0
    let totalForks = 0

    data.data.user.repositories.nodes.forEach((repo: any) => {
      totalStars += repo.stargazerCount
      totalForks += repo.forkCount

      if (repo.languages?.edges) {
        repo.languages.edges.forEach((edge: any) => {
          const existing = languageMap.get(edge.node.name) || { bytes: 0, color: edge.node.color }
          languageMap.set(edge.node.name, {
            bytes: existing.bytes + edge.size,
            color: edge.node.color,
          })
        })
      }
    })

    const totalBytes = Array.from(languageMap.values()).reduce((sum, { bytes }) => sum + bytes, 0)
    console.log('Total language bytes:', totalBytes)
    console.log('Language map:', Array.from(languageMap.entries()))
    
    const topLanguages = Array.from(languageMap.entries())
      .map(([name, { bytes, color }]) => ({
        name,
        color,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100 * 10) / 10 : 0, // One decimal place
      }))
      .filter((lang) => lang.percentage > 0) // Only show languages with > 0%
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8) // Show top 8 languages instead of 5
    
    console.log('Top languages:', topLanguages)

    // Get featured repositories (top 4 by stars)
    const featuredRepos = data.data.user.repositories.nodes
      .filter((repo: any) => repo.stargazerCount > 0 || repo.description)
      .sort((a: any, b: any) => b.stargazerCount - a.stargazerCount)
      .slice(0, 4)
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description || 'No description available',
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        language: repo.primaryLanguage?.name || 'Unknown',
        color: repo.primaryLanguage?.color || '#8257e5',
        url: repo.url,
      }))

    const stats = {
      totalRepos: data.data.user.repositories.totalCount,
      totalStars,
      totalForks,
      followers: data.data.user.followers.totalCount,
      following: data.data.user.following.totalCount,
      contributions: data.data.user.contributionsCollection.contributionCalendar.totalContributions,
      topLanguages,
      featuredRepos,
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
