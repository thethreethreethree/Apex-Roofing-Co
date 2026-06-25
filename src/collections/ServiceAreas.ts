import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/** Per-city pages for local SEO. Each generates /service-areas/[slug]. */
export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  labels: { singular: 'Service Area', plural: 'Service Areas' },
  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'state', 'featured'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', required: true, admin: { width: '60%' } },
        { name: 'state', type: 'text', defaultValue: 'TX', admin: { width: '40%' } },
      ],
    },
    slugField('city'),
    {
      name: 'intro',
      type: 'textarea',
      admin: { description: 'Short local intro shown on cards and at the top of the area page.' },
    },
    { name: 'content', type: 'richText', admin: { description: 'Localized body copy for SEO.' } },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      admin: { description: 'Google Maps embed URL for this area (optional).' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Highlight in the service-area section.' },
    },
  ],
}
