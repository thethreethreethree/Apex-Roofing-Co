import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

const adminOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/**
 * Double-booking guard (model layer, defense-in-depth). On create, count
 * non-cancelled bookings already holding this slot and reject if at/over the
 * configured crew capacity. The booking action checks too; this hook is the
 * structural backstop so the rule can't be bypassed.
 */
const capacityGuard: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create' && data?.slot) {
    const settings = await req.payload.findGlobal({ slug: 'availability-settings' })
    const capacity = settings?.capacityPerSlot ?? 1
    const { totalDocs } = await req.payload.count({
      collection: 'bookings',
      where: {
        and: [{ slot: { equals: data.slot } }, { status: { not_equals: 'cancelled' } }],
      },
    })
    if (totalDocs >= capacity) {
      throw new Error('That time slot just filled up. Please choose another time.')
    }
  }
  return data
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: { singular: 'Booking', plural: 'Bookings' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slotLabel', 'service', 'status'],
    group: 'Inbox',
  },
  access: {
    read: adminOnly,
    create: () => false, // created via the booking server action (Local API)
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: { beforeChange: [capacityGuard] },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'confirmed',
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No-show', value: 'no-show' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'slot',
      type: 'text',
      required: true,
      admin: { readOnly: true, description: 'Slot key (YYYY-MM-DDTHH:mm).' },
    },
    {
      name: 'slotLabel',
      type: 'text',
      admin: { readOnly: true, description: 'Human-readable appointment time.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'phone', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', admin: { width: '50%' } },
        { name: 'service', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'address', type: 'text', admin: { description: 'Address where we’ll park and groom (the pet’s location).' } },
    { name: 'notes', type: 'textarea' },
  ],
}
