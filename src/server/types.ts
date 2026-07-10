/**
 * Frontend-facing content types for the custom backend. These replace the
 * Payload-generated `@/server/types` — they describe the exact objects the
 * public components consume and the read layer (server/queries.ts) returns.
 */
export type RichText = unknown // Lexical editor state (opaque JSON)

export type Media = {
  id: number
  alt?: string | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  createdAt?: string
  updatedAt?: string
}

export type ServiceIconName = 'groom' | 'bath' | 'deshed' | 'nails' | 'flea' | 'cat'

export type Service = {
  id: number
  title: string
  slug: string
  summary?: string | null
  description?: RichText | null
  priceRange?: string | null
  icon?: ServiceIconName | string | null
  image?: Media | number | null
  featured?: boolean | null
  order?: number | null
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}

export type Review = {
  id: number
  author: string
  rating: number
  text: string
  date?: string | null
  location?: string | null
  source?: string | null
  service?: Service | number | null
  featured?: boolean | null
}

export type Project = {
  id: number
  title: string
  slug: string
  service?: Service | number | null
  city?: string | null
  completedDate?: string | null
  beforeImage?: Media | number | null
  afterImage?: Media | number | null
  gallery?: { image?: Media | number | null }[] | null
  description?: string | null
  linkedReview?: Review | number | null
  featured?: boolean | null
}

export type Certification = {
  id: number
  name: string
  logo?: Media | number | null
  description?: string | null
  link?: string | null
  order?: number | null
}

export type FinancingOption = {
  id: number
  name: string
  description?: string | null
  terms?: string | null
  partnerLogo?: Media | number | null
  order?: number | null
}

export type SiteSetting = {
  companyName?: string | null
  tagline?: string | null
  phone?: string | null
  emergencyPhone?: string | null
  email?: string | null
  address?: {
    street?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
  } | null
  hours?: { days?: string | null; time?: string | null; id?: string | null }[] | null
  social?: {
    google?: string | null
    facebook?: string | null
    instagram?: string | null
    yelp?: string | null
  } | null
  license?: string | null
  yearsInBusiness?: number | null
  insuranceStatement?: string | null
  googleRating?: number | null
  googleReviewCount?: number | null
}

export type Branding = {
  logo?: Media | number | null
  logoLight?: Media | number | null
  favicon?: Media | number | null
  primaryColor?: string | null
  accentColor?: string | null
}

export type HomePage = {
  hero?: {
    heading?: string | null
    subheading?: string | null
    backgroundImage?: Media | number | null
    primaryCtaLabel?: string | null
    secondaryCtaLabel?: string | null
  } | null
  trustBadges?: { label?: string | null; id?: string | null }[] | null
  whyUs?: { title?: string | null; description?: string | null; id?: string | null }[] | null
  sections?: {
    showProjects?: boolean | null
    showReviews?: boolean | null
    showServiceAreas?: boolean | null
    showFinancing?: boolean | null
  } | null
  finalCta?: {
    heading?: string | null
    subheading?: string | null
    ctaLabel?: string | null
  } | null
}

export type FinancingInfo = {
  heading?: string | null
  intro?: string | null
  insuranceClaimHelp?: RichText | null
}
