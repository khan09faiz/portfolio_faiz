/**
 * Application constants
 * Centralized configuration for the portfolio
 */

// ============================================================================
// Personal Information
// ============================================================================

// Site Configuration
export const SITE_CONFIG = {
  name: 'Mohammad Faiz Khan',
  title: 'AI Engineer | Systems Developer | Intelligent Automation',
  description: 'AI Engineer specializing in Computer Vision, Time Series Forecasting, and Reinforcement Learning. Building intelligent systems that solve real-world problems with Python, TensorFlow, PyTorch, and modern web technologies.',
  siteUrl: 'https://khan09faiz.dev', // Update with your actual domain
  ogImage: '/og-home.jpg',
  contact: {
    email: 'khan09faiz@gmail.com',
    phone: '+91-9289633563',
  },
  links: {
    github: 'https://github.com/khan09faiz',
    linkedin: 'https://www.linkedin.com/in/khan09faiz/',
    twitter: '', // Optional - add if you have
  },
  githubUsername: 'khan09faiz',
  person: {
    jobTitle: 'AI Engineer | Systems Developer | Intelligent Automation',
    location: 'Jaipur, India',
    bio: `Hey! I'm Faiz, a builder who thinks in algorithms and dreams in code. Passionate about AI/ML, full-stack development, and creating intelligent systems that solve real-world problems.`,
    alumniOf: 'Manipal University Jaipur',
    knowsAbout: [
      'Computer Vision',
      'Time Series Forecasting',
      'Reinforcement Learning',
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Full Stack Development',
      'Python',
      'TensorFlow',
      'PyTorch',
      'React',
      'Next.js',
      'Django',
      'FastAPI',
      'SAP ABAP',
    ],
  },
} as const

// Legacy export for compatibility
export const PERSONAL_INFO = {
  name: SITE_CONFIG.name,
  email: SITE_CONFIG.contact.email,
  phone: SITE_CONFIG.contact.phone,
  github: SITE_CONFIG.links.github,
  linkedin: SITE_CONFIG.links.linkedin,
  location: SITE_CONFIG.person.location,
  tagline: 'AI Engineer | Systems Developer | Intelligent Automation',
  bio: `Hey! I'm Faiz, a builder who thinks in algorithms and dreams in code.

By day, I'm exploring machine learning and reinforcement learning, trying to make systems a little smarter. By night, I'm usually debugging something late or diving into stock markets, because I genuinely enjoy understanding how money, data, and decisions intersect.

I'm studying AI/ML, but most of my learning comes from building, experimenting, and constantly challenging myself. I love tech, competition, and figuring out how things work under the hood.

Football is my daily reset. No pressure, no stats, just the game, the discipline, and the fun that comes with it.

Travel helps me recharge and see things differently. New places and new perspectives often spark my best ideas.

If it involves logic, data, investing, or making computers think, I'm all in. Long term, my goal is simple. Build something from scratch that actually matters.

So if you're looking for someone who codes, invests, travels, and still shows up to play football every day, let's talk.

Hala Madrid 🚀⚽️`,
} as const

// ============================================================================
// GitHub Configuration
// ============================================================================

export const GITHUB_CONFIG = {
  username: 'khan09faiz',
  apiUrl: 'https://api.github.com/graphql',
  revalidateTime: 3600, // 1 hour in seconds
} as const

// ============================================================================
// Navigation Links
// ============================================================================

export const NAV_ITEMS = [
  { label: 'About', href: '/' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Certificates', href: '/#certificates' },
  { label: 'Career', href: '/#timeline' },
  { label: 'GitHub', href: '/#github' },
  { label: 'Contact', href: '/#contact' },
] as const

// Legacy export for compatibility
export const NAV_LINKS = NAV_ITEMS

// ============================================================================
// Social Links
// ============================================================================

export const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/khan09faiz',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/khan09faiz/',
    icon: 'linkedin',
  },
  {
    name: 'Email',
    url: 'mailto:khan09faiz@gmail.com',
    icon: 'mail',
  },
] as const

// ============================================================================
// Animation Configuration
// ============================================================================

export const ANIMATION_CONFIG = {
  particleCount: 100,
  particleColor: '#00D9FF',
  particleOpacity: 0.3,
  particleSize: 2,
  particleSpeed: 0.5,
  connectionDistance: 150,
  lineOpacity: 0.2,
} as const

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const

// ============================================================================
// Layout Constants
// ============================================================================

export const LAYOUT = {
  MAX_WIDTH: 'max-w-7xl',
  CONTAINER: 'container mx-auto px-3 sm:px-4 md:px-6 lg:px-8',
  SECTION_PADDING: 'py-12 sm:py-16 lg:py-20',
  GRID_GAP: 'gap-4 sm:gap-5 lg:gap-6',
} as const

// ============================================================================
// Theme Configuration
// ============================================================================

export const THEME = {
  colors: {
    primary: '#00D9FF',
    background: '#0A0E27',
    card: '#0F1629',
    elevated: '#1A1F3A',
  },
} as const
