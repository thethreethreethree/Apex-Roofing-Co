import { getSiteSettings } from '@/lib/payload'

/**
 * LocalBusiness JSON-LD for the mobile grooming business. Kept minimal (name,
 * phone, rating) — the owner can extend address/areaServed in Site Settings.
 */
export const Schema = async () => {
  const settings = await getSiteSettings()

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.companyName,
    description: settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    ...(settings.googleRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: settings.googleRating,
        reviewCount: settings.googleReviewCount ?? undefined,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
