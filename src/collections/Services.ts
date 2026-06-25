import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priceRange', 'featured', 'order'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      admin: { description: 'One or two sentences shown on cards and previews.' },
    },
    { name: 'description', type: 'richText', admin: { description: 'Full service-page body.' } },
    {
      name: 'priceRange',
      type: 'text',
      admin: { description: 'e.g. "$8,000–$25,000" or "From $350". Shown for transparency.' },
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'roof',
      options: [
        { label: 'Roof / Replacement', value: 'roof' },
        { label: 'Repair / Wrench', value: 'repair' },
        { label: 'Inspection / Shield', value: 'inspection' },
        { label: 'Gutters / Water', value: 'gutters' },
        { label: 'Storm / Bolt', value: 'storm' },
        { label: 'Commercial / Building', value: 'commercial' },
      ],
      admin: { description: 'Icon shown on the service card.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
    },
  ],
}
