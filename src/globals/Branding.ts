import type { GlobalConfig } from 'payload'

/**
 * Visual identity. The two color fields are injected as CSS variables in the
 * layout, so changing them here re-themes the whole site (buttons, headers,
 * accents) without touching code.
 */
export const Branding: GlobalConfig = {
  slug: 'branding',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Primary logo (shown in the header on a light background).' },
    },
    {
      name: 'logoLight',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional white/light logo for dark backgrounds (footer).' },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Browser tab icon (square PNG/SVG).' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#102a43',
          admin: { width: '50%', description: 'Brand color (hex) — dark sections, headings.' },
        },
        {
          name: 'accentColor',
          type: 'text',
          defaultValue: '#f97316',
          admin: { width: '50%', description: 'Accent/CTA color (hex) — buttons.' },
        },
      ],
    },
  ],
}
