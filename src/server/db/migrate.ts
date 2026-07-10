import 'dotenv/config'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { db, client } from './index'

/**
 * Apply the generated SQL migrations to the custom backend's database.
 * Run with: `npx tsx src/server/db/migrate.ts`
 */
const run = async () => {
  await migrate(db, { migrationsFolder: './src/server/db/migrations' })
  console.log('[migrate] ✓ schema applied')
  client.close()
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[migrate] FAILED', e)
    process.exit(1)
  })
