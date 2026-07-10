/**
 * Content reads for the custom backend.
 *
 * Kept at this path so existing frontend imports from '@/lib/payload' are
 * unchanged. Despite the filename, there is no Payload dependency anymore — these
 * are the Drizzle-backed reads from the custom backend.
 */
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
