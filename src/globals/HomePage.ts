import type { GlobalConfig } from 'payload'

/** Editable content for the homepage hero, trust points, and section toggles. */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Mobile Dog & Cat Grooming That Comes to You',
        },
        {
          name: 'subheading',
          type: 'textarea',
          defaultValue:
            'Professional, low-stress grooming right in your driveway across Phelan and the High Desert. One pet at a time — no cages, no car rides — just a happy, fresh-smelling pet.',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Hero background photo (a happy, freshly groomed pet works best).' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'primaryCtaLabel',
              type: 'text',
              defaultValue: 'Book an Appointment',
              admin: { width: '50%' },
            },
            {
              name: 'secondaryCtaLabel',
              type: 'text',
              defaultValue: 'See Packages & Pricing',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'trustBadges',
      type: 'array',
      label: 'Trust Bar Points',
      admin: { description: 'Short proof points shown under the hero.' },
      defaultValue: [
        { label: 'Fully Mobile' },
        { label: 'One Pet at a Time' },
        { label: 'Gentle & Low-Stress' },
        { label: 'Serving the High Desert' },
      ],
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'whyUs',
      type: 'array',
      label: 'Why Choose Us',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'sections',
      type: 'group',
      label: 'Section Visibility',
      admin: { description: 'Toggle homepage sections on/off.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'showProjects', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            { name: 'showReviews', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            {
              name: 'showServiceAreas',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '25%' },
            },
            {
              name: 'showFinancing',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '25%', description: 'Show the Packages & Pricing section.' },
            },
          ],
        },
      ],
    },
    {
      name: 'finalCta',
      type: 'group',
      label: 'Closing Call-to-Action',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Ready for a Happier Grooming Day?' },
        {
          name: 'subheading',
          type: 'text',
          defaultValue: 'Book your mobile grooming appointment — we come to you.',
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Book an Appointment' },
      ],
    },
  ],
}
