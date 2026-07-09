import type { GlobalConfig } from 'payload'

/**
 * Single source of truth for business identity / NAP (name, address, phone).
 * Consumed by the header, footer, contact page, and local-business schema —
 * editing it here updates every surface at once.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'companyName',
          type: 'text',
          required: true,
          defaultValue: 'Shaggy Dog Spa Mobile Grooming',
          admin: { width: '50%' },
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'Grooming That Comes to You',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          defaultValue: '(760) 269-6239',
          admin: { width: '50%', description: 'Main phone — used for click-to-call.' },
        },
        {
          name: 'emergencyPhone',
          type: 'text',
          defaultValue: '',
          admin: { width: '50%', description: 'After-hours / text line (optional).' },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'hello@shaggydogspa.example',
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text', admin: { width: '40%' } },
            { name: 'state', type: 'text', admin: { width: '30%' } },
            { name: 'zip', type: 'text', admin: { width: '30%' } },
          ],
        },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      label: 'Business Hours',
      admin: { description: 'One row per line, e.g. "Tue – Sat" / "9:00 AM – 6:00 PM".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'days', type: 'text', admin: { width: '50%' } },
            { name: 'time', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social & Review Profiles',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'google', type: 'text', admin: { width: '50%' } },
            { name: 'facebook', type: 'text', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'instagram', type: 'text', admin: { width: '50%' } },
            { name: 'yelp', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Trust & Credentials',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'license',
              type: 'text',
              defaultValue: '',
              admin: { width: '50%', description: 'State license number, if applicable.' },
            },
            {
              name: 'yearsInBusiness',
              type: 'number',
              admin: { width: '50%', description: 'Optional — leave blank if you’d rather not state it.' },
            },
          ],
        },
        {
          name: 'insuranceStatement',
          type: 'text',
          defaultValue: 'Insured mobile grooming',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'googleRating',
              type: 'number',
              defaultValue: 5,
              admin: { width: '50%', step: 0.1, description: 'Average star rating (e.g. 4.9).' },
            },
            {
              name: 'googleReviewCount',
              type: 'number',
              defaultValue: 26,
              admin: { width: '50%', description: 'Total review count.' },
            },
          ],
        },
      ],
    },
  ],
}
