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
      admin: { description: 'e.g. "From $75" or "Add-on $25". Shown for transparency.' },
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'groom',
      options: [
        { label: 'Full Groom / Scissors', value: 'groom' },
        { label: 'Bath / Droplet', value: 'bath' },
        { label: 'Deshedding / Brush', value: 'deshed' },
        { label: 'Nails / Paw', value: 'nails' },
        { label: 'Flea & Tick / Shield', value: 'flea' },
        { label: 'Cat Grooming / Cat', value: 'cat' },
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
