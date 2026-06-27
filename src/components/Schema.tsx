import { getSiteSettings } from '@/lib/payload'

/**
 * RoofingContractor JSON-LD. Region-neutral by design — no address or areaServed,
 * so the demo doesn't tie the business to any specific location.
 */
export const Schema = async () => {
  const settings = await getSiteSettings()

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
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
