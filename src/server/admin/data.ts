/**
 * Admin read helpers (guarded). Used by the custom admin's server components.
 * Tables are generic (driven by config), so a few `any` casts are unavoidable.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm'
import { db } from '@/server/db'
import { requireUser } from '@/server/auth/session'
import { collections, type CollectionSlug } from './config'
import { globals, type GlobalSlug } from './globals'

export type Row = Record<string, unknown>

/** The single row of a global (or null if not yet created). */
export async function getGlobalRow(slug: GlobalSlug): Promise<Row | null> {
  await requireUser()
  const cfg = globals[slug]
  const rows = (await db.select().from(cfg.table as any).limit(1)) as Row[]
  return rows[0] ?? null
}

export async function listRows(slug: CollectionSlug): Promise<Row[]> {
  await requireUser()
  const cfg = collections[slug]
  return (await db.select().from(cfg.table as any)) as Row[]
}

export async function getRow(slug: CollectionSlug, id: number): Promise<Row | null> {
  await requireUser()
  const cfg = collections[slug]
  const rows = (await db
    .select()
    .from(cfg.table as any)
    .where(eq((cfg.table as any).id, id))
    .limit(1)) as Row[]
  return rows[0] ?? null
}

export type FieldOption = { id: number; label: string; url?: string; alt?: string }

/**
 * Options for a relationship/upload picker. For `media`, each option also carries
 * its `url` and `alt` so the visual "Replace Image" control can render thumbnails
 * (of the current value and the "choose existing" grid). Non-media relationships
 * return { id, label } as before.
 */
export async function optionsFor(slug: CollectionSlug): Promise<FieldOption[]> {
  await requireUser()
  const cfg = collections[slug]
  const rows = (await db.select().from(cfg.table as any)) as Row[]
  if (slug === 'media') {
    return rows.map((r) => ({
      id: r.id as number,
      label: String(r.alt || r.filename || `#${r.id}`),
      url: r.filename ? `/media-file/${String(r.filename)}` : undefined,
      alt: typeof r.alt === 'string' ? r.alt : '',
    }))
  }
  return rows.map((r) => ({ id: r.id as number, label: String(r[cfg.titleField] ?? `#${r.id}`) }))
}
