import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'

let cached: Promise<Payload> | null = null

/**
 * Payload Local API client. During the backend transition this is still used by
 * the **write** server actions (leads, bookings) and the booking-availability
 * read. All content **reads** now come from the custom backend (Drizzle) via the
 * re-exports below, so the public site renders off the custom backend.
 */
export const getPayloadClient = (): Promise<Payload> => {
  if (!cached) cached = getPayload({ config })
  return cached
}

// Content reads — served by the custom backend. Re-exported here so existing
// frontend imports from '@/lib/payload' are unchanged.
export {
  getServices,
  getServiceBySlug,
  getProjects,
  getReviews,
  getCertifications,
  getFinancingOptions,
  getSiteSettings,
  getBranding,
  getHomePage,
  getFinancingInfo,
} from '@/server/queries'
