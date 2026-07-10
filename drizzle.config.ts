import { defineConfig } from 'drizzle-kit'

/**
 * Drizzle Kit config for the custom backend. `generate` diffs the schema into
 * SQL migration files (no DB connection needed); those migrations are applied at
 * runtime via drizzle-orm/libsql/migrator (see src/server/db/migrate.ts).
 */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/server/db/schema.ts',
  out: './src/server/db/migrations',
})
