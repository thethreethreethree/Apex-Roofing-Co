/**
 * Custom backend — database connection (Drizzle + libsql).
 *
 * Uses its own database file (default `shaggy-app.db`) so it coexists with
 * Payload's `shaggy.db` during the transition; they are merged/cut over later.
 */
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

// Single application database. Set DATABASE_URI (a libsql/sqlite URL, e.g.
// file:./shaggy.db) in production; defaults to a local file for zero-setup dev.
const url = process.env.DATABASE_URI || 'file:./shaggy.db'

export const client = createClient({ url })
export const db = drizzle(client, { schema })
export { schema }
