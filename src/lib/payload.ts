import { cache } from 'react'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

let cached: Promise<Payload> | null = null

/** Singleton Payload Local API client for server components. */
export const getPayloadClient = (): Promise<Payload> => {
  if (!cached) cached = getPayload({ config })
  return cached
}

// Globals --------------------------------------------------------------------
export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getBranding = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'branding', depth: 1 })
})

export const getHomePage = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home-page', depth: 1 })
})

export const getFinancingInfo = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'financing-info', depth: 1 })
})

// Collections ----------------------------------------------------------------
export const getServices = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return docs
})

export const getServiceBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getProjects = cache(async (limit = 50) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    sort: '-completedDate',
    limit,
    depth: 1,
  })
  return docs
})

export const getReviews = cache(async (limit = 50) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'reviews',
    sort: '-date',
    limit,
    depth: 1,
  })
  return docs
})

export const getServiceAreas = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'service-areas',
    sort: 'city',
    limit: 100,
    depth: 1,
  })
  return docs
})

export const getServiceAreaBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'service-areas',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getCertifications = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'certifications',
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return docs
})

export const getFinancingOptions = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'financing-options',
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return docs
})
