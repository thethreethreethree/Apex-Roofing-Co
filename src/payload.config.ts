import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Services } from './collections/Services'
import { Projects } from './collections/Projects'
import { Reviews } from './collections/Reviews'
import { ServiceAreas } from './collections/ServiceAreas'
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

// Database is chosen by environment: a postgres:// URL (Supabase/Neon/Vercel in
// production) uses the Postgres adapter; otherwise it falls back to local SQLite
// for zero-setup development.
const databaseUrl =
  process.env.DATABASE_URI ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  'file:./apex-demo.db'
const usePostgres = databaseUrl.startsWith('postgres')

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Apex Roofing Co',
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Projects,
    Reviews,
    ServiceAreas,
    Certifications,
    Financing,
    Leads,
    Bookings,
    Blackouts,
  ],
  globals: [SiteSettings, Branding, HomePage, FinancingInfo, AvailabilitySettings],
  editor: lexicalEditor(),
  // Email: uses Resend in production when RESEND_API_KEY is set; otherwise Payload
  // logs emails to the console (dev) so the flow is fully testable without a key.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@apexroofing.example',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'Apex Roofing Co',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usePostgres
    ? postgresAdapter({ pool: { connectionString: databaseUrl } })
    : sqliteAdapter({ client: { url: databaseUrl } }),
  sharp,
  plugins: [
    // Cloud media storage in production (Vercel's filesystem is ephemeral).
    // Active only when a Blob token is present; local dev uses the disk.
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
