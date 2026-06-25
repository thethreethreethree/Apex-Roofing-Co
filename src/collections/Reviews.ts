import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'rating', 'source', 'featured'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'author', type: 'text', required: true },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: { description: 'Stars, 1–5.' },
    },
    { name: 'text', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'date', admin: { width: '33%' } },
        { name: 'location', type: 'text', admin: { width: '33%', description: 'City/area.' } },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'Google',
          options: ['Google', 'Facebook', 'Yelp', 'Direct'],
          admin: { width: '34%' },
        },
      ],
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      admin: { description: 'Which service this review is about (optional).' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the homepage.' },
    },
  ],
}
