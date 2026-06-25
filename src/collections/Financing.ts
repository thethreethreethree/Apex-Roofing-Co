import type { CollectionConfig } from 'payload'

export const Financing: CollectionConfig = {
  slug: 'financing-options',
  labels: { singular: 'Financing Option', plural: 'Financing Options' },
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
      admin: { description: 'e.g. "0% APR for 12 months" or "Low monthly payments".' },
    },
    { name: 'partnerLogo', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
