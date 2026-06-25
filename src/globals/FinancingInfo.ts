import type { GlobalConfig } from 'payload'

/** Intro copy for the Financing & Insurance page (the option cards live in the Financing collection). */
export const FinancingInfo: GlobalConfig = {
  slug: 'financing-info',
  label: 'Financing & Insurance',
  admin: { group: 'Pages' },
  access: { read: () => true },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Flexible Financing & Insurance Claim Help',
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'A new roof is a major investment — we make it manageable. Choose from several financing plans, or let our team guide you through an insurance claim after storm damage.',
    },
    {
      name: 'insuranceClaimHelp',
      type: 'richText',
      label: 'Insurance Claim Help',
      admin: { description: 'Explain how you help homeowners file and win storm/insurance claims.' },
    },
  ],
}
