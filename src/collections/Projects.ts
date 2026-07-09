import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'

/** Before/after grooming gallery — the highest-converting content on a groomer's site. */
export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Projects' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'service', 'featured'],
    group: 'Content',
  },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'service', type: 'relationship', relationTo: 'services' },
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', admin: { width: '50%' } },
        { name: 'completedDate', type: 'date', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'beforeImage',
          type: 'upload',
          relationTo: 'media',
          admin: { width: '50%', description: 'Before photo.' },
        },
        {
          name: 'afterImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { width: '50%', description: 'After photo (required).' },
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      admin: { description: 'Additional photos for the project detail view.' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'linkedReview',
      type: 'relationship',
      relationTo: 'reviews',
      admin: { description: 'Optionally tie this project to the customer review about it.' },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
