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
          defaultValue: 'Quality Roofing, Done Right the First Time',
        },
        {
          name: 'subheading',
          type: 'textarea',
          defaultValue:
            'Licensed, insured, and trusted by hundreds of local homeowners. Free inspections, honest estimates, and workmanship backed by a written warranty.',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Hero background photo (a real completed roof works best).' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'primaryCtaLabel',
              type: 'text',
              defaultValue: 'Book a Free Inspection',
              admin: { width: '50%' },
            },
            {
              name: 'secondaryCtaLabel',
              type: 'text',
              defaultValue: 'Get a Free Estimate',
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
        { label: 'Licensed & Insured' },
        { label: '18+ Years Local' },
        { label: 'Free Estimates' },
        { label: 'Workmanship Warranty' },
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
              admin: { width: '25%' },
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
        { name: 'heading', type: 'text', defaultValue: 'Ready to Protect Your Home?' },
        {
          name: 'subheading',
          type: 'text',
          defaultValue: 'Book your free, no-obligation roof inspection today.',
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Book Your Free Inspection' },
      ],
    },
  ],
}
