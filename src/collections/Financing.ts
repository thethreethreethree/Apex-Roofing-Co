import type { CollectionConfig } from 'payload'

/**
 * Grooming packages. Slug stays `financing-options` internally (to avoid a
 * schema migration); everything user- and admin-facing reads as "Packages".
 */
export const Financing: CollectionConfig = {
  slug: 'financing-options',
  labels: { singular: 'Package', plural: 'Packages' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'terms', 'order'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'terms',
      type: 'text',
      admin: { description: 'Price line, e.g. "From $75" or "Add-on $25".' },
    },
    { name: 'partnerLogo', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
