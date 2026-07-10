import { getSiteSettings } from '@/lib/content'

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
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    priceRange: '$$',
    // Address is a single source of truth (Site Settings). areaServed is the
    // verified mobile service area (High Desert), hardcoded as it rarely changes.
    ...(settings.address?.city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: settings.address.city,
        addressRegion: settings.address.state || undefined,
        postalCode: settings.address.zip || undefined,
        addressCountry: 'US',
      },
    }),
    areaServed: [
      'Phelan', 'Piñon Hills', 'Oak Hills', 'Wrightwood', 'Hesperia',
      'Victorville', 'Apple Valley', 'Adelanto', 'Lucerne Valley', 'Helendale',
    ].map((name) => ({ '@type': 'City', name })),
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
