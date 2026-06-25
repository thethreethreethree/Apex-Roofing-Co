import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/** Specific dates with no booking availability (holidays, time off). */
export const Blackouts: CollectionConfig = {
  slug: 'blackouts',
  labels: { singular: 'Blackout Date', plural: 'Blackout Dates' },
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'reason'],
    group: 'Settings',
  },
  access: {
    read: () => true,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
        description: 'A day with no inspection availability.',
      },
    },
    { name: 'reason', type: 'text', admin: { description: 'Optional note (e.g. Holiday).' } },
  ],
}
