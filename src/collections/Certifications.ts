import type { CollectionConfig } from 'payload'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  labels: { singular: 'Trust Badge', plural: 'Trust Badges' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'What this trust point means for the customer (builds trust).' },
    },
    { name: 'link', type: 'text', admin: { description: 'Link to the certifying body (optional).' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
