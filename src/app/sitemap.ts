import type { MetadataRoute } from 'next'
import { getServices, getServiceAreas } from '@/lib/payload'

// Generate on-demand (not at build time) so the production build never depends
// on the database being reachable during `next build`.
export const dynamic = 'force-dynamic'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, areas] = await Promise.all([getServices(), getServiceAreas()])

  const staticRoutes = [
    '',
    '/services',
    '/projects',
    '/service-areas',
    '/reviews',
    '/financing',
    '/about',
    '/contact',
    '/book',
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const serviceRoutes = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const areaRoutes = areas.map((a) => ({
    url: `${BASE}/service-areas/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes]
}
