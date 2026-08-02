import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { StructuredData } from '@/components/seo'
import { Analytics } from '@vercel/analytics/react'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { BrushCursor } from '@/components/ui/BrushCursor'
import { InkIntensityToggle } from '@/components/ui/InkIntensityToggle'
import { SITE_CONFIG } from '@/lib/constants'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: 'Mohammad Faiz Khan - AI/ML Engineer & Full-Stack Developer',
    template: '%s | Mohammad Faiz Khan',
  },
  description:
    'AI/ML Engineer specializing in hybrid models (SARIMA-GARCH), computer vision (YOLOv8), and reinforcement learning (PPO). Built production systems at ONGC and Tenet Networks.',
  keywords: [
    'Mohammad Faiz Khan',
    'AI Engineer',
    'Machine Learning Engineer',
    'Full-Stack Developer',
    'React Developer',
    'Next.js Developer',
    'Python AI',
    'TensorFlow',
    'PyTorch',
  ],
  authors: [{ name: 'Mohammad Faiz Khan', url: 'https://github.com/khan09faiz' }],
  creator: 'Mohammad Faiz Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.siteUrl,
    siteName: 'Mohammad Faiz Khan Portfolio',
    title: 'Mohammad Faiz Khan - AI/ML Engineer',
    description: 'Building intelligent systems with hybrid AI models, computer vision, and reinforcement learning.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mohammad Faiz Khan - AI/ML Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammad Faiz Khan - AI/ML Engineer',
    description: 'Building intelligent systems with hybrid AI models and computer vision',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <StructuredData />
        {/*
          Applies the crimson intensity before first paint so the palette never
          flashes from restrained to bold during hydration. Reads ?ink= first so
          a preview link can pin a variant, otherwise falls back to the stored
          choice. No attribute at all means restrained.
          PREVIEW-ONLY — remove alongside <InkIntensityToggle /> before merge.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var q=new URLSearchParams(location.search).get('ink');var v=q||localStorage.getItem('ink-intensity');if(v==='bold'){document.documentElement.setAttribute('data-ink','bold')}if(q){localStorage.setItem('ink-intensity',q)}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans">
        <AnimatedBackground />
        <BrushCursor />
        <Header />
        {children}
        <InkIntensityToggle />
        <Analytics />
      </body>
    </html>
  )
}
