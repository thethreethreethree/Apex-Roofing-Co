'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/server/db'
import { requireUser } from '@/server/auth/session'
import { collections, type CollectionSlug, type FieldDef } from './config'
import { globals, type GlobalSlug } from './globals'

export type SaveResult = { ok: true; id: number } | { ok: false; error: string }

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/** Coerce a FormData into a typed row per the field definitions (+ required validation). */
function coerceFields(fields: FieldDef[], form: FormData): { data: Record<string, unknown>; error?: string } {
  const data: Record<string, unknown> = {}
  for (const f of fields) {
    if (f.type === 'checkbox') {
      data[f.name] = form.get(f.name) != null
      continue
    }
    const raw = form.get(f.name)
    const s = raw == null ? '' : String(raw).trim()
    if (f.required && s === '') return { data, error: `${f.label} is required.` }
    switch (f.type) {
      case 'number':
        data[f.name] = s === '' ? null : Number(s)
        break
      case 'upload':
      case 'relationship':
        data[f.name] = s === '' ? null : Number(s)
        break
      case 'json':
      case 'richText':
        if (s === '') {
          data[f.name] = null
          break
        }
        try {
          data[f.name] = JSON.parse(s)
        } catch {
          return { data, error: `${f.label} must be valid JSON.` }
        }
        break
      default:
        data[f.name] = s === '' && !f.required ? null : s
    }
  }
  return { data }
}

const friendlyError = (e: unknown): string => {
  const msg = e instanceof Error ? e.message : 'Save failed.'
  return /unique/i.test(msg) ? 'That value must be unique (e.g. the slug is already taken).' : msg
}

export async function saveRow(slug: CollectionSlug, id: number | null, form: FormData): Promise<SaveResult> {
  await requireUser()
  const cfg = collections[slug]
  if (id == null && cfg.createDisabled) return { ok: false, error: 'This collection cannot be created from the admin.' }

  const { data, error } = coerceFields(cfg.fields, form)
  if (error) return { ok: false, error }

  // Auto-slug from the title field when a slug field exists and is blank.
  if (cfg.fields.some((f) => f.name === 'slug') && !data.slug) {
    const src = data[cfg.titleField]
    if (typeof src === 'string' && src) data.slug = slugify(src)
  }

  const now = new Date()
  try {
    if (id == null) {
      const [row] = await db
        .insert(cfg.table as any)
        .values({ ...data, createdAt: now, updatedAt: now })
        .returning({ id: (cfg.table as any).id })
      revalidatePath(`/manage/${slug}`)
      return { ok: true, id: row.id as number }
    }
    await db
      .update(cfg.table as any)
      .set({ ...data, updatedAt: now })
      .where(eq((cfg.table as any).id, id))
    revalidatePath(`/manage/${slug}`)
    return { ok: true, id }
  } catch (e) {
    return { ok: false, error: friendlyError(e) }
  }
}

export async function deleteRow(slug: CollectionSlug, id: number): Promise<void> {
  await requireUser()
  const cfg = collections[slug]
  await db.delete(cfg.table as any).where(eq((cfg.table as any).id, id))
  revalidatePath(`/manage/${slug}`)
  redirect(`/manage/${slug}`)
}

/** Save a single-row global (update the existing row, or insert if missing). */
export async function saveGlobal(slug: GlobalSlug, form: FormData): Promise<SaveResult> {
  await requireUser()
  const cfg = globals[slug]
  const { data, error } = coerceFields(cfg.fields, form)
  if (error) return { ok: false, error }
  try {
    const existing = (await db
      .select({ id: (cfg.table as any).id })
      .from(cfg.table as any)
      .limit(1)) as { id: number }[]
    if (existing.length) {
      await db
        .update(cfg.table as any)
        .set(data)
        .where(eq((cfg.table as any).id, existing[0].id))
      revalidatePath('/', 'layout')
      return { ok: true, id: existing[0].id }
    }
    const [row] = await db
      .insert(cfg.table as any)
      .values(data)
      .returning({ id: (cfg.table as any).id })
    revalidatePath('/', 'layout')
    return { ok: true, id: row.id as number }
  } catch (e) {
    return { ok: false, error: friendlyError(e) }
  }
}
