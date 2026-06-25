import { getSiteSettings, getServiceAreas } from '@/lib/payload'

/** LocalBusiness / RoofingContractor JSON-LD for local SEO. Rendered once in the layout. */
export const Schema = async () => {
  const [settings, areas] = await Promise.all([getSiteSettings(), getServiceAreas()])
  const a = settings.address

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: settings.companyName,
    description: settings.tagline,
    telephone: settings.phone,
    email: settings.email,
    ...(a && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: a.street,
        addressLocality: a.city,
        addressRegion: a.state,
        postalCode: a.zip,
        addressCountry: 'US',
      },
    }),
    ...(settings.googleRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: settings.googleRating,
        reviewCount: settings.googleReviewCount ?? undefined,
      },
    }),
    areaServed: areas.map((ar) => `${ar.city}, ${ar.state}`),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
