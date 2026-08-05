import { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /admin is also noindex'd via metadata in app/admin/layout.tsx —
      // robots.txt asks crawlers not to fetch, meta tells them not to index.
      // They cover different behaviours, so both are set.
      disallow: ['/api/', '/_next/', '/admin'],
    },
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
  }
}
