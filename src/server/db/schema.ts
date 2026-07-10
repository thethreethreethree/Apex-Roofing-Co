/**
 * Custom backend — Drizzle schema (SQLite via libsql).
 *
 * This is the data layer that replaces Payload. It mirrors the exact field set
 * of the current Payload collections + globals so the public site can run on it
 * unchanged.
 *
 * Design decisions (documented, not silent):
 * - **Groups** (address, social, hero, finalCta, sections) are flattened into
 *   prefixed columns on their parent table — cleaner for single-row globals than
 *   a join.
 * - **Small ordered arrays** (hours, trustBadges, whyUs, gallery) and **richText**
 *   (Lexical) are stored as JSON text columns. These are always read/written as a
 *   unit and never queried by inner value, so a child table would add joins for no
 *   benefit. Relationships between top-level entities use real integer FKs.
 * - Booleans are SQLite integers (0/1); timestamps are unix-ms integers; dates the
 *   app sorts on (completedDate, review date) are ISO text.
 */
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core'

// --- richText / array JSON shapes -------------------------------------------
export type RichText = unknown // Lexical editor state (opaque JSON)
export type HoursRow = { days?: string; time?: string }
export type TrustBadge = { label?: string }
export type WhyUsItem = { title?: string; description?: string }

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
}

// --- Auth --------------------------------------------------------------------
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  ...timestamps,
})

// --- Media -------------------------------------------------------------------
export const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  alt: text('alt').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type'),
  filesize: integer('filesize'),
  width: integer('width'),
  height: integer('height'),
  ...timestamps,
})

// --- Content collections -----------------------------------------------------
export const services = sqliteTable('services', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  description: text('description', { mode: 'json' }).$type<RichText>(),
  priceRange: text('price_range'),
  icon: text('icon').default('groom'),
  imageId: integer('image_id').references(() => media.id),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  order: integer('order').default(0),
  ...timestamps,
})

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  author: text('author').notNull(),
  rating: integer('rating').notNull().default(5),
  text: text('text').notNull(),
  date: text('date'), // ISO
  location: text('location'),
  source: text('source').default('Google'),
  serviceId: integer('service_id').references(() => services.id),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  ...timestamps,
})

export const certifications = sqliteTable('certifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  logoId: integer('logo_id').references(() => media.id),
  description: text('description'),
  link: text('link'),
  order: integer('order').default(0),
  ...timestamps,
})

export const packages = sqliteTable('packages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  terms: text('terms'),
  partnerLogoId: integer('partner_logo_id').references(() => media.id),
  order: integer('order').default(0),
  ...timestamps,
})

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  serviceId: integer('service_id').references(() => services.id),
  city: text('city'),
  completedDate: text('completed_date'), // ISO
  beforeImageId: integer('before_image_id').references(() => media.id),
  afterImageId: integer('after_image_id').references(() => media.id),
  gallery: text('gallery', { mode: 'json' }).$type<number[]>(), // media ids
  description: text('description'),
  linkedReviewId: integer('linked_review_id').references(() => reviews.id),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  ...timestamps,
})

// --- Inbox collections (created via server actions) --------------------------
export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  service: text('service'),
  message: text('message'),
  sourcePage: text('source_page'),
  status: text('status').default('new'),
  ...timestamps,
})

export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  status: text('status').default('confirmed'),
  slot: text('slot').notNull(),
  slotLabel: text('slot_label'),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  service: text('service'),
  notes: text('notes'),
  ...timestamps,
})

export const blackouts = sqliteTable('blackouts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(), // ISO day
  reason: text('reason'),
  ...timestamps,
})

// --- Globals (single row, id = 1) --------------------------------------------
export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyName: text('company_name'),
  tagline: text('tagline'),
  phone: text('phone'),
  emergencyPhone: text('emergency_phone'),
  email: text('email'),
  addressStreet: text('address_street'),
  addressCity: text('address_city'),
  addressState: text('address_state'),
  addressZip: text('address_zip'),
  hours: text('hours', { mode: 'json' }).$type<HoursRow[]>(),
  socialGoogle: text('social_google'),
  socialFacebook: text('social_facebook'),
  socialInstagram: text('social_instagram'),
  socialYelp: text('social_yelp'),
  license: text('license'),
  yearsInBusiness: integer('years_in_business'),
  insuranceStatement: text('insurance_statement'),
  googleRating: real('google_rating'),
  googleReviewCount: integer('google_review_count'),
})

export const branding = sqliteTable('branding', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  logoId: integer('logo_id').references(() => media.id),
  logoLightId: integer('logo_light_id').references(() => media.id),
  faviconId: integer('favicon_id').references(() => media.id),
  primaryColor: text('primary_color'),
  accentColor: text('accent_color'),
})

export const homePage = sqliteTable('home_page', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  heroHeading: text('hero_heading'),
  heroSubheading: text('hero_subheading'),
  heroBackgroundImageId: integer('hero_background_image_id').references(() => media.id),
  heroPrimaryCtaLabel: text('hero_primary_cta_label'),
  heroSecondaryCtaLabel: text('hero_secondary_cta_label'),
  trustBadges: text('trust_badges', { mode: 'json' }).$type<TrustBadge[]>(),
  whyUs: text('why_us', { mode: 'json' }).$type<WhyUsItem[]>(),
  showProjects: integer('show_projects', { mode: 'boolean' }).default(true),
  showReviews: integer('show_reviews', { mode: 'boolean' }).default(true),
  showServiceAreas: integer('show_service_areas', { mode: 'boolean' }).default(true),
  showFinancing: integer('show_financing', { mode: 'boolean' }).default(true),
  finalCtaHeading: text('final_cta_heading'),
  finalCtaSubheading: text('final_cta_subheading'),
  finalCtaCtaLabel: text('final_cta_cta_label'),
})

export const financingInfo = sqliteTable('financing_info', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  heading: text('heading'),
  intro: text('intro'),
  insuranceClaimHelp: text('insurance_claim_help', { mode: 'json' }).$type<RichText>(),
})

export const availabilitySettings = sqliteTable('availability_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  days: text('days', { mode: 'json' }).$type<string[]>(),
  startTime: text('start_time'),
  endTime: text('end_time'),
  slotMinutes: integer('slot_minutes'),
  capacityPerSlot: integer('capacity_per_slot'),
  weeksAhead: integer('weeks_ahead'),
  minLeadHours: integer('min_lead_hours'),
})
