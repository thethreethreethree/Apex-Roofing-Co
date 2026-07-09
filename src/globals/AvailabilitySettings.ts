import type { GlobalConfig } from 'payload'

/** Controls the self-scheduling booking calendar. Sensible defaults so it works out of the box. */
export const AvailabilitySettings: GlobalConfig = {
  slug: 'availability-settings',
  label: 'Booking Availability',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      name: 'days',
      type: 'select',
      hasMany: true,
      label: 'Available weekdays',
      defaultValue: ['1', '2', '3', '4', '5'],
      options: [
        { label: 'Monday', value: '1' },
        { label: 'Tuesday', value: '2' },
        { label: 'Wednesday', value: '3' },
        { label: 'Thursday', value: '4' },
        { label: 'Friday', value: '5' },
        { label: 'Saturday', value: '6' },
        { label: 'Sunday', value: '0' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'text',
          defaultValue: '08:00',
          admin: { width: '50%', description: 'First slot (24h, e.g. 08:00).' },
        },
        {
          name: 'endTime',
          type: 'text',
          defaultValue: '16:00',
          admin: { width: '50%', description: 'Slots end before this (24h, e.g. 16:00).' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'slotMinutes',
          type: 'number',
          defaultValue: 60,
          admin: { width: '33%', description: 'Slot length (minutes).' },
        },
        {
          name: 'capacityPerSlot',
          type: 'number',
          defaultValue: 2,
          admin: { width: '33%', description: 'Max appointments per slot (vans/groomers).' },
        },
        {
          name: 'weeksAhead',
          type: 'number',
          defaultValue: 3,
          admin: { width: '34%', description: 'How far ahead bookable (weeks).' },
        },
      ],
    },
    {
      name: 'minLeadHours',
      type: 'number',
      defaultValue: 24,
      admin: { description: 'Minimum notice before a slot can be booked (hours).' },
    },
  ],
}
