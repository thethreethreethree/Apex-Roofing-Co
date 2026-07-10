/**
 * Custom backend — read layer.
 *
 * Drizzle queries shaped to match the exact objects the frontend components
 * consume: media resolved to an object with a `.url`, relationships resolved, and
 * the single-row globals re-nested into their group shapes. Returns are typed
 * explicitly (audit F5) so the compiler checks the shapes rather than `as unknown`.
 *
 * `lib/payload.ts` re-exports these, so no frontend file changes.
 * Media is served by the custom /media-file/<filename> route.
 */
import { cache } from 'react'
import { asc, desc } from 'drizzle-orm'
import { db, schema } from './db'
import type {
  Service,
  Review,
  Project,
  Certification,
  FinancingOption,
  SiteSetting,
  Branding,
  HomePage,
  FinancingInfo,
  Media,
} from '@/server/types'

// --- media resolution --------------------------------------------------------
type MediaRow = typeof schema.media.$inferSelect
const shapeMedia = (m: MediaRow): Media => ({
  id: m.id,
  alt: m.alt,
  url: `/media-file/${m.filename}`,
  filename: m.filename,
  mimeType: m.mimeType,
  filesize: m.filesize,
  width: m.width,
  height: m.height,
  updatedAt: (m.updatedAt ?? new Date()).toISOString(),
  createdAt: (m.createdAt ?? new Date()).toISOString(),
})

const loadMediaMap = async (): Promise<Map<number, Media>> => {
  const rows = await db.select().from(schema.media)
  return new Map(rows.map((r) => [r.id, shapeMedia(r)]))
}

const mediaOf = (map: Map<number, Media>, id: number | null | undefined): Media | null =>
  id != null ? (map.get(id) ?? null) : null

// --- collections -------------------------------------------------------------
export const getServices = cache(async (): Promise<Service[]> => {
  const [rows, mediaMap] = await Promise.all([
    db.select().from(schema.services).orderBy(asc(schema.services.order)),
    loadMediaMap(),
  ])
  return rows.map((s): Service => ({ ...s, image: mediaOf(mediaMap, s.imageId) }))
})

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const services = await getServices()
  return services.find((s) => s.slug === slug) ?? null
})

export const getReviews = cache(async (limit = 50): Promise<Review[]> => {
  const rows = await db.select().from(schema.reviews).orderBy(desc(schema.reviews.date)).limit(limit)
  return rows.map((r): Review => ({ ...r }))
})

export const getCertifications = cache(async (): Promise<Certification[]> => {
  const [rows, mediaMap] = await Promise.all([
    db.select().from(schema.certifications).orderBy(asc(schema.certifications.order)),
    loadMediaMap(),
  ])
  return rows.map((c): Certification => ({ ...c, logo: mediaOf(mediaMap, c.logoId) }))
})

export const getFinancingOptions = cache(async (): Promise<FinancingOption[]> => {
  const [rows, mediaMap] = await Promise.all([
    db.select().from(schema.packages).orderBy(asc(schema.packages.order)),
    loadMediaMap(),
  ])
  return rows.map((p): FinancingOption => ({ ...p, partnerLogo: mediaOf(mediaMap, p.partnerLogoId) }))
})

export const getProjects = cache(async (limit = 50): Promise<Project[]> => {
  const [rows, mediaMap, reviews] = await Promise.all([
    db.select().from(schema.projects).orderBy(desc(schema.projects.completedDate)).limit(limit),
    loadMediaMap(),
    getReviews(),
  ])
  const reviewById = new Map(reviews.map((r) => [r.id, r]))
  return rows.map(
    (p): Project => ({
      ...p,
      beforeImage: mediaOf(mediaMap, p.beforeImageId),
      afterImage: mediaOf(mediaMap, p.afterImageId),
      gallery: Array.isArray(p.gallery)
        ? p.gallery.map((id) => ({ image: mediaOf(mediaMap, id) }))
        : null,
      linkedReview: p.linkedReviewId != null ? (reviewById.get(p.linkedReviewId) ?? null) : null,
    }),
  )
})

// --- globals -----------------------------------------------------------------
export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const [s] = await db.select().from(schema.siteSettings).limit(1)
  return {
    companyName: s?.companyName,
    tagline: s?.tagline,
    phone: s?.phone,
    emergencyPhone: s?.emergencyPhone,
    email: s?.email,
    address: {
      street: s?.addressStreet,
      city: s?.addressCity,
      state: s?.addressState,
      zip: s?.addressZip,
    },
    hours: s?.hours ?? [],
    social: {
      google: s?.socialGoogle,
      facebook: s?.socialFacebook,
      instagram: s?.socialInstagram,
      yelp: s?.socialYelp,
    },
    license: s?.license,
    yearsInBusiness: s?.yearsInBusiness,
    insuranceStatement: s?.insuranceStatement,
    googleRating: s?.googleRating,
    googleReviewCount: s?.googleReviewCount,
  }
})

export const getBranding = cache(async (): Promise<Branding> => {
  const [[b], mediaMap] = await Promise.all([
    db.select().from(schema.branding).limit(1),
    loadMediaMap(),
  ])
  return {
    logo: mediaOf(mediaMap, b?.logoId),
    logoLight: mediaOf(mediaMap, b?.logoLightId),
    favicon: mediaOf(mediaMap, b?.faviconId),
    primaryColor: b?.primaryColor,
    accentColor: b?.accentColor,
  }
})

export const getHomePage = cache(async (): Promise<HomePage> => {
  const [[h], mediaMap] = await Promise.all([
    db.select().from(schema.homePage).limit(1),
    loadMediaMap(),
  ])
  return {
    hero: {
      heading: h?.heroHeading,
      subheading: h?.heroSubheading,
      backgroundImage: mediaOf(mediaMap, h?.heroBackgroundImageId),
      primaryCtaLabel: h?.heroPrimaryCtaLabel,
      secondaryCtaLabel: h?.heroSecondaryCtaLabel,
    },
    trustBadges: h?.trustBadges ?? [],
    whyUs: h?.whyUs ?? [],
    sections: {
      showProjects: h?.showProjects,
      showReviews: h?.showReviews,
      showServiceAreas: h?.showServiceAreas,
      showFinancing: h?.showFinancing,
    },
    finalCta: {
      heading: h?.finalCtaHeading,
      subheading: h?.finalCtaSubheading,
      ctaLabel: h?.finalCtaCtaLabel,
    },
  }
})

export const getFinancingInfo = cache(async (): Promise<FinancingInfo> => {
  const [f] = await db.select().from(schema.financingInfo).limit(1)
  return {
    heading: f?.heading,
    intro: f?.intro,
    insuranceClaimHelp: f?.insuranceClaimHelp,
  }
})
