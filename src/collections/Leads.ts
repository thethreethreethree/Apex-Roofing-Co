import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

/**
 * Lead / quote-request inbox. Submissions are created server-side via the
 * submitLead server action (Local API, which bypasses access control), so public
 * REST create is disabled here to prevent spam. Only logged-in admins can read.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Lead', plural: 'Leads' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'service', 'status', 'createdAt'],
    group: 'Inbox',
  },
  access: {
    read: adminOnly,
    create: () => false,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
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
        { name: 'service', type: 'text', admin: { width: '50%', description: 'Service of interest.' } },
      ],
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'sourcePage',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true, description: 'Where the request came from.' },
    },
  ],
}
