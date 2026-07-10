/**
 * Custom backend — database connection (Drizzle + libsql).
 *
 * Uses its own database file (default `shaggy-app.db`) so it coexists with
 * Payload's `shaggy.db` during the transition; they are merged/cut over later.
 */
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

// The custom backend uses its OWN database file — never Payload's DATABASE_URI
// (whose table structure differs). Override only via APP_DATABASE_URI.
const url = process.env.APP_DATABASE_URI || 'file:./shaggy-app.db'

export const client = createClient({ url })
export const db = drizzle(client, { schema })
export { schema }
