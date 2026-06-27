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
          defaultValue: 'Apex Roofing Co',
          admin: { width: '50%' },
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'Roofing You Can Trust',
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
          defaultValue: '(555) 720-7663',
          admin: { width: '50%', description: 'Main phone — used for click-to-call.' },
        },
        {
          name: 'emergencyPhone',
          type: 'text',
          defaultValue: '(555) 720-0911',
          admin: { width: '50%', description: '24/7 emergency line (optional).' },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      defaultValue: 'hello@apexroofing.example',
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
      admin: { description: 'One row per line, e.g. "Mon–Fri" / "7:00 AM – 6:00 PM".' },
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
              defaultValue: 'Lic. #0098124',
              admin: { width: '50%', description: 'License number.' },
            },
            {
              name: 'yearsInBusiness',
              type: 'number',
              defaultValue: 18,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'insuranceStatement',
          type: 'text',
          defaultValue: 'Fully licensed, bonded & insured',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'googleRating',
              type: 'number',
              defaultValue: 4.9,
              admin: { width: '50%', step: 0.1, description: 'Average star rating (e.g. 4.9).' },
            },
            {
              name: 'googleReviewCount',
              type: 'number',
              defaultValue: 327,
              admin: { width: '50%', description: 'Total review count.' },
            },
          ],
        },
      ],
    },
  ],
}
