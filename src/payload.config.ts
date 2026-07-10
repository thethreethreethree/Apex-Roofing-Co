import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { Reviews } from './collections/Reviews'
import { Certifications } from './collections/Certifications'
import { Financing } from './collections/Financing'
import { Leads } from './collections/Leads'
import { Bookings } from './collections/Bookings'
import { Blackouts } from './collections/Blackouts'

import { SiteSettings } from './globals/SiteSettings'
import { Branding } from './globals/Branding'
import { HomePage } from './globals/HomePage'
import { FinancingInfo } from './globals/FinancingInfo'
import { AvailabilitySettings } from './globals/AvailabilitySettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Single-file SQLite database — no external database service (no Supabase/Postgres).
// Point DATABASE_URI at any writable file path; defaults to a local file so the app
// runs self-hosted on one server with zero cloud dependencies.
const databaseUrl = process.env.DATABASE_URI || 'file:./shaggy.db'

// Fail fast in production if the auth secret is missing — an empty secret would
// sign forgeable admin sessions. In dev, fall back to a fixed placeholder so the
// app still runs locally with zero setup.
const payloadSecret = process.env.PAYLOAD_SECRET
if (!payloadSecret && process.env.NODE_ENV === 'production') {
  throw new Error(
    'PAYLOAD_SECRET is required in production. Set it in .env, e.g. `openssl rand -hex 32`.',
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
    },
    meta: {
      titleSuffix: '— Shaggy Dog Spa',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/icon.svg' }],
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Projects,
    Reviews,
    Certifications,
    Financing,
    Leads,
    Bookings,
    Blackouts,
  ],
  globals: [SiteSettings, Branding, HomePage, FinancingInfo, AvailabilitySettings],
  editor: lexicalEditor(),
  // No email adapter: lead/booking notifications are written to the server console.
  // Every lead and booking is also saved and visible in the admin Inbox, so nothing
  // is lost. Add an SMTP/email adapter later if you want delivered notifications.
  secret: payloadSecret || 'dev-only-insecure-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Media is stored on the server's local disk (see Media collection staticDir) and
  // served by the app at /api/media/file/* — no external object storage (no Blob).
  db: sqliteAdapter({ client: { url: databaseUrl } }),
  sharp,
})
