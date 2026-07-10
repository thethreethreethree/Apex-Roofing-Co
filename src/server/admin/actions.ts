'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/server/db'
import { requireUser } from '@/server/auth/session'
import { collections, type CollectionConfig, type CollectionSlug } from './config'

export type SaveResult = { ok: true; id: number } | { ok: false; error: string }

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function coerce(cfg: CollectionConfig, form: FormData): { data: Record<string, unknown>; error?: string } {
  const data: Record<string, unknown> = {}
  for (const f of cfg.fields) {
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
  // Auto-slug from the title field when a slug field exists and is blank.
  if (cfg.fields.some((f) => f.name === 'slug') && !data.slug) {
    const src = data[cfg.titleField]
    if (typeof src === 'string' && src) data.slug = slugify(src)
  }
  return { data }
}

export async function saveRow(slug: CollectionSlug, id: number | null, form: FormData): Promise<SaveResult> {
  await requireUser()
  const cfg = collections[slug]
  if (id == null && cfg.createDisabled) return { ok: false, error: 'This collection cannot be created from the admin.' }

  const { data, error } = coerce(cfg, form)
  if (error) return { ok: false, error }

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
    const msg = e instanceof Error ? e.message : 'Save failed.'
    // Friendlier message for the common unique-constraint (slug) case.
    return { ok: false, error: /unique/i.test(msg) ? 'That value must be unique (e.g. the slug is already taken).' : msg }
  }
}

export async function deleteRow(slug: CollectionSlug, id: number): Promise<void> {
  await requireUser()
  const cfg = collections[slug]
  await db.delete(cfg.table as any).where(eq((cfg.table as any).id, id))
  revalidatePath(`/manage/${slug}`)
  redirect(`/manage/${slug}`)
}
