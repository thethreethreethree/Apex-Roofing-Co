import type { GlobalConfig } from 'payload'

/**
 * Intro copy for the Packages & Pricing page (the package cards live in the
 * "financing-options" collection, repurposed as packages). The slug stays
 * `financing-info` internally to avoid a schema migration — only the labels and
 * user-facing copy are grooming-oriented.
 */
export const FinancingInfo: GlobalConfig = {
  slug: 'financing-info',
  label: 'Packages & Pricing',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Grooming Packages & Pricing',
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'Simple, upfront pricing for mobile grooming that comes to you. Final price depends on your pet’s size, coat, and condition — you’ll always get a clear quote before we start.',
    },
    {
      name: 'insuranceClaimHelp',
      type: 'richText',
      label: 'Good to Know',
      admin: { description: 'Notes on pricing, add-ons, and what can affect the final quote.' },
    },
  ],
}
