/**
 * Admin configuration — drives the generic list + form UI for the custom admin.
 * One entry per manageable collection; `fields` lists the editable columns using
 * the Drizzle table's JS property names.
 */
import { schema } from '../db'
import type { SQLiteTable } from 'drizzle-orm/sqlite-core'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'email'
  | 'date'
  | 'richText'
  | 'upload'
  | 'relationship'
  | 'json'

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: string[] // for select
  relTo?: CollectionSlug // for relationship/upload
  help?: string
}

export type CollectionSlug =
  | 'services'
  | 'reviews'
  | 'projects'
  | 'certifications'
  | 'packages'
  | 'media'
  | 'leads'
  | 'bookings'
  | 'blackouts'

export type CollectionConfig = {
  slug: CollectionSlug
  label: string
  singular: string
  table: SQLiteTable
  titleField: string
  listColumns: string[]
  fields: FieldDef[]
  createDisabled?: boolean // inbox collections are created by the public site, not the admin
}

export const collections: Record<CollectionSlug, CollectionConfig> = {
  services: {
    slug: 'services',
    label: 'Services',
    singular: 'Service',
    table: schema.services,
    titleField: 'title',
    listColumns: ['title', 'priceRange', 'featured', 'order'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', help: 'URL segment; auto-set from title if blank.' },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'description', label: 'Description (rich text)', type: 'richText' },
      { name: 'priceRange', label: 'Price', type: 'text' },
      { name: 'icon', label: 'Icon', type: 'select', options: ['groom', 'bath', 'deshed', 'nails', 'flea', 'cat'] },
      { name: 'imageId', label: 'Image', type: 'upload' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  reviews: {
    slug: 'reviews',
    label: 'Reviews',
    singular: 'Review',
    table: schema.reviews,
    titleField: 'author',
    listColumns: ['author', 'rating', 'source', 'featured'],
    fields: [
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', required: true },
      { name: 'text', label: 'Review text', type: 'textarea', required: true },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'source', label: 'Source', type: 'select', options: ['Google', 'Facebook', 'Yelp', 'Direct'] },
      { name: 'serviceId', label: 'Service', type: 'relationship', relTo: 'services' },
      { name: 'featured', label: 'Show on homepage', type: 'checkbox' },
    ],
  },
  projects: {
    slug: 'projects',
    label: 'Gallery',
    singular: 'Project',
    table: schema.projects,
    titleField: 'title',
    listColumns: ['title', 'city', 'featured'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'serviceId', label: 'Service', type: 'relationship', relTo: 'services' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'completedDate', label: 'Completed date', type: 'date' },
      { name: 'beforeImageId', label: 'Before image', type: 'upload' },
      { name: 'afterImageId', label: 'After image', type: 'upload' },
      // `gallery` (a JSON list of media ids) is intentionally NOT exposed here: the
      // public site renders only the before/after pair, so a raw-JSON id box would
      // be a footgun that changes nothing on the page. The column is kept in the
      // schema (data preserved); re-add this field if a multi-photo gallery section
      // is ever built on the projects page.
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'linkedReviewId', label: 'Linked review', type: 'relationship', relTo: 'reviews' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
    ],
  },
  certifications: {
    slug: 'certifications',
    label: 'Trust Badges',
    singular: 'Trust Badge',
    table: schema.certifications,
    titleField: 'name',
    listColumns: ['name', 'order'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'logoId', label: 'Logo', type: 'upload' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'link', label: 'Link', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  packages: {
    slug: 'packages',
    label: 'Packages',
    singular: 'Package',
    table: schema.packages,
    titleField: 'name',
    listColumns: ['name', 'terms', 'order'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'terms', label: 'Price line', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'partnerLogoId', label: 'Logo', type: 'upload' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  media: {
    slug: 'media',
    label: 'Media',
    singular: 'Media',
    table: schema.media,
    titleField: 'filename',
    listColumns: ['filename', 'alt', 'width', 'height'],
    fields: [{ name: 'alt', label: 'Alt text', type: 'text', required: true }],
  },
  leads: {
    slug: 'leads',
    label: 'Leads',
    singular: 'Lead',
    table: schema.leads,
    titleField: 'name',
    listColumns: ['name', 'phone', 'service', 'status'],
    createDisabled: true,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'service', label: 'Service', type: 'text' },
      { name: 'message', label: 'Message', type: 'textarea' },
      { name: 'sourcePage', label: 'Source page', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'scheduled', 'closed'] },
    ],
  },
  bookings: {
    slug: 'bookings',
    label: 'Bookings',
    singular: 'Booking',
    table: schema.bookings,
    titleField: 'name',
    listColumns: ['name', 'slotLabel', 'service', 'status'],
    createDisabled: true,
    fields: [
      { name: 'status', label: 'Status', type: 'select', options: ['confirmed', 'completed', 'cancelled', 'no-show'] },
      { name: 'slotLabel', label: 'When', type: 'text' },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'service', label: 'Service', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  blackouts: {
    slug: 'blackouts',
    label: 'Blackout Dates',
    singular: 'Blackout Date',
    table: schema.blackouts,
    titleField: 'date',
    listColumns: ['date', 'reason'],
    fields: [
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'reason', label: 'Reason', type: 'text' },
    ],
  },
}

export const collectionList = Object.values(collections)
