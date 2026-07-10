/**
 * Custom backend — read layer.
 *
 * Drizzle queries shaped to match the exact objects the frontend components
 * consume (the same shapes Payload returned at depth: 1): media resolved to an
 * object with a `.url`, relationships resolved, and the single-row globals
 * re-nested into their group shapes (address, social, hero, sections, finalCta).
 *
 * `lib/payload.ts` re-exports these, so no frontend file changes when the data
 * source moves from Payload to the custom backend.
 *
 * Media URL note: during the transition media is served by Payload's existing
 * /api/media/file/<filename> route (the files on disk are shared). A dedicated
 * custom media route replaces that at cutover.
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
} from '@/payload-types'

// --- media resolution --------------------------------------------------------
type MediaRow = typeof schema.media.$inferSelect
const shapeMedia = (m: MediaRow | undefined | null): Media | null =>
  m
    ? ({
        id: m.id,
        alt: m.alt,
        url: `/api/media/file/${m.filename}`,
        filename: m.filename,
        mimeType: m.mimeType ?? undefined,
        filesize: m.filesize ?? undefined,
        width: m.width ?? undefined,
        height: m.height ?? undefined,
        updatedAt: (m.updatedAt ?? new Date()).toISOString?.() ?? new Date().toISOString(),
        createdAt: (m.createdAt ?? new Date()).toISOString?.() ?? new Date().toISOString(),
      } as unknown as Media)
    : null

const loadMediaMap = async (): Promise<Map<number, Media>> => {
  const rows = await db.select().from(schema.media)
  const map = new Map<number, Media>()
  for (const r of rows) {
    const shaped = shapeMedia(r)
    if (shaped) map.set(r.id, shaped)
  }
  return map
}

const mediaOf = (map: Map<number, Media>, id: number | null | undefined): Media | undefined =>
  id != null ? map.get(id) : undefined

// --- collections -------------------------------------------------------------
export const getServices = cache(async (): Promise<Service[]> => {
  const [rows, mediaMap] = await Promise.all([
    db.select().from(schema.services).orderBy(asc(schema.services.order)),
    loadMediaMap(),
  ])
  return rows.map((s) => ({ ...s, image: mediaOf(mediaMap, s.imageId) }) as unknown as Service)
})

export const getServiceBySlug = cache(async (slug: string): Promise<Service | null> => {
  const services = await getServices()
  return services.find((s) => s.slug === slug) ?? null
})

export const getReviews = cache(async (limit = 50): Promise<Review[]> => {
  const rows = await db.select().from(schema.reviews).orderBy(desc(schema.reviews.date)).limit(limit)
  return rows as unknown as Review[]
})

export const getCertifications = cache(async (): Promise<Certification[]> => {
  const [rows, mediaMap] = await Promise.all([
    db.select().from(schema.certifications).orderBy(asc(schema.certifications.order)),
    loadMediaMap(),
  ])
  return rows.map((c) => ({ ...c, logo: mediaOf(mediaMap, c.logoId) }) as unknown as Certification)
})

export const getFinancingOptions = cache(async (): Promise<FinancingOption[]> => {
  const [rows, mediaMap] = await Promise.all([
    db.select().from(schema.packages).orderBy(asc(schema.packages.order)),
    loadMediaMap(),
  ])
  return rows.map((p) => ({ ...p, partnerLogo: mediaOf(mediaMap, p.partnerLogoId) }) as unknown as FinancingOption)
})

export const getProjects = cache(async (limit = 50): Promise<Project[]> => {
  const [rows, mediaMap, reviews] = await Promise.all([
    db.select().from(schema.projects).orderBy(desc(schema.projects.completedDate)).limit(limit),
    loadMediaMap(),
    getReviews(),
  ])
  const reviewById = new Map(reviews.map((r) => [r.id, r]))
  return rows.map(
    (p) =>
      ({
        ...p,
        beforeImage: mediaOf(mediaMap, p.beforeImageId),
        afterImage: mediaOf(mediaMap, p.afterImageId),
        gallery: Array.isArray(p.gallery)
          ? p.gallery.map((id) => ({ image: mediaOf(mediaMap, id) }))
          : undefined,
        linkedReview: p.linkedReviewId != null ? reviewById.get(p.linkedReviewId) : undefined,
      }) as unknown as Project,
  )
})

// --- globals -----------------------------------------------------------------
export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const [row] = await db.select().from(schema.siteSettings).limit(1)
  const s = row ?? ({} as typeof schema.siteSettings.$inferSelect)
  return {
    companyName: s.companyName,
    tagline: s.tagline,
    phone: s.phone,
    emergencyPhone: s.emergencyPhone,
    email: s.email,
    address: {
      street: s.addressStreet,
      city: s.addressCity,
      state: s.addressState,
      zip: s.addressZip,
    },
    hours: s.hours ?? [],
    social: {
      google: s.socialGoogle,
      facebook: s.socialFacebook,
      instagram: s.socialInstagram,
      yelp: s.socialYelp,
    },
    license: s.license,
    yearsInBusiness: s.yearsInBusiness,
    insuranceStatement: s.insuranceStatement,
    googleRating: s.googleRating,
    googleReviewCount: s.googleReviewCount,
  } as unknown as SiteSetting
})

export const getBranding = cache(async (): Promise<Branding> => {
  const [[row], mediaMap] = await Promise.all([
    db.select().from(schema.branding).limit(1),
    loadMediaMap(),
  ])
  const b = row ?? ({} as typeof schema.branding.$inferSelect)
  return {
    logo: mediaOf(mediaMap, b.logoId),
    logoLight: mediaOf(mediaMap, b.logoLightId),
    favicon: mediaOf(mediaMap, b.faviconId),
    primaryColor: b.primaryColor,
    accentColor: b.accentColor,
  } as unknown as Branding
})

export const getHomePage = cache(async (): Promise<HomePage> => {
  const [[row], mediaMap] = await Promise.all([
    db.select().from(schema.homePage).limit(1),
    loadMediaMap(),
  ])
  const h = row ?? ({} as typeof schema.homePage.$inferSelect)
  return {
    hero: {
      heading: h.heroHeading,
      subheading: h.heroSubheading,
      backgroundImage: mediaOf(mediaMap, h.heroBackgroundImageId),
      primaryCtaLabel: h.heroPrimaryCtaLabel,
      secondaryCtaLabel: h.heroSecondaryCtaLabel,
    },
    trustBadges: h.trustBadges ?? [],
    whyUs: h.whyUs ?? [],
    sections: {
      showProjects: h.showProjects,
      showReviews: h.showReviews,
      showServiceAreas: h.showServiceAreas,
      showFinancing: h.showFinancing,
    },
    finalCta: {
      heading: h.finalCtaHeading,
      subheading: h.finalCtaSubheading,
      ctaLabel: h.finalCtaCtaLabel,
    },
  } as unknown as HomePage
})

export const getFinancingInfo = cache(async (): Promise<FinancingInfo> => {
  const [row] = await db.select().from(schema.financingInfo).limit(1)
  const f = row ?? ({} as typeof schema.financingInfo.$inferSelect)
  return {
    heading: f.heading,
    intro: f.intro,
    insuranceClaimHelp: f.insuranceClaimHelp,
  } as unknown as FinancingInfo
})
