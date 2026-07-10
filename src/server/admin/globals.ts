/**
 * Admin configuration for the single-row globals — drives their edit forms.
 * Group fields are flattened columns; small arrays / richText are JSON fields.
 */
import type { SQLiteTable } from 'drizzle-orm/sqlite-core'
import { schema } from '../db'
import type { FieldDef } from './config'

export type GlobalSlug =
  | 'site-settings'
  | 'branding'
  | 'home-page'
  | 'financing-info'
  | 'availability-settings'

export type GlobalConfig = {
  slug: GlobalSlug
  label: string
  table: SQLiteTable
  fields: FieldDef[]
}

export const globals: Record<GlobalSlug, GlobalConfig> = {
  'site-settings': {
    slug: 'site-settings',
    label: 'Site Settings',
    table: schema.siteSettings,
    fields: [
      { name: 'companyName', label: 'Company name', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'emergencyPhone', label: 'After-hours / text line', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'addressStreet', label: 'Street', type: 'text' },
      { name: 'addressCity', label: 'City', type: 'text' },
      { name: 'addressState', label: 'State', type: 'text' },
      { name: 'addressZip', label: 'ZIP', type: 'text' },
      {
        name: 'hours',
        label: 'Hours',
        type: 'json',
        itemFields: [
          { name: 'days', label: 'Days (e.g. Tue–Sat)' },
          { name: 'time', label: 'Hours (e.g. 9am–6pm)' },
        ],
      },
      { name: 'socialGoogle', label: 'Google URL', type: 'text' },
      { name: 'socialFacebook', label: 'Facebook URL', type: 'text' },
      { name: 'socialInstagram', label: 'Instagram URL', type: 'text' },
      { name: 'socialYelp', label: 'Yelp URL', type: 'text' },
      { name: 'license', label: 'License', type: 'text' },
      { name: 'yearsInBusiness', label: 'Years in business', type: 'number' },
      { name: 'insuranceStatement', label: 'Insurance statement', type: 'text' },
      { name: 'googleRating', label: 'Star rating', type: 'number' },
      { name: 'googleReviewCount', label: 'Review count', type: 'number' },
    ],
  },
  branding: {
    slug: 'branding',
    label: 'Branding',
    table: schema.branding,
    fields: [
      { name: 'logoId', label: 'Logo', type: 'upload' },
      { name: 'logoLightId', label: 'Logo (light)', type: 'upload' },
      { name: 'faviconId', label: 'Favicon', type: 'upload' },
      { name: 'primaryColor', label: 'Primary color (hex)', type: 'text' },
      { name: 'accentColor', label: 'Accent color (hex)', type: 'text' },
    ],
  },
  'home-page': {
    slug: 'home-page',
    label: 'Home Page',
    table: schema.homePage,
    fields: [
      { name: 'heroHeading', label: 'Hero heading', type: 'text' },
      { name: 'heroSubheading', label: 'Hero subheading', type: 'textarea' },
      { name: 'heroBackgroundImageId', label: 'Hero background image', type: 'upload' },
      { name: 'heroPrimaryCtaLabel', label: 'Primary CTA label', type: 'text' },
      { name: 'heroSecondaryCtaLabel', label: 'Secondary CTA label', type: 'text' },
      {
        name: 'trustBadges',
        label: 'Trust bar',
        type: 'json',
        itemFields: [{ name: 'label', label: 'Badge text' }],
      },
      {
        name: 'whyUs',
        label: 'Why-us',
        type: 'json',
        itemFields: [
          { name: 'title', label: 'Title' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ],
      },
      { name: 'showProjects', label: 'Show gallery section', type: 'checkbox' },
      { name: 'showReviews', label: 'Show reviews section', type: 'checkbox' },
      { name: 'showServiceAreas', label: 'Show service-areas section', type: 'checkbox' },
      { name: 'showFinancing', label: 'Show packages section', type: 'checkbox' },
      { name: 'finalCtaHeading', label: 'Closing heading', type: 'text' },
      { name: 'finalCtaSubheading', label: 'Closing subheading', type: 'text' },
      { name: 'finalCtaCtaLabel', label: 'Closing CTA label', type: 'text' },
    ],
  },
  'financing-info': {
    slug: 'financing-info',
    label: 'Packages Intro',
    table: schema.financingInfo,
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'intro', label: 'Intro', type: 'textarea' },
      { name: 'insuranceClaimHelp', label: 'Notes (rich text JSON)', type: 'richText' },
    ],
  },
  'availability-settings': {
    slug: 'availability-settings',
    label: 'Booking Availability',
    table: schema.availabilitySettings,
    fields: [
      { name: 'days', label: 'Weekdays (JSON: ["2","3","4","5","6"], 0=Sun)', type: 'json' },
      { name: 'startTime', label: 'Start time (HH:mm)', type: 'text' },
      { name: 'endTime', label: 'End time (HH:mm)', type: 'text' },
      { name: 'slotMinutes', label: 'Slot length (min)', type: 'number' },
      { name: 'capacityPerSlot', label: 'Capacity per slot', type: 'number' },
      { name: 'weeksAhead', label: 'Weeks bookable ahead', type: 'number' },
      { name: 'minLeadHours', label: 'Min lead time (hours)', type: 'number' },
    ],
  },
}

export const globalList = Object.values(globals)
