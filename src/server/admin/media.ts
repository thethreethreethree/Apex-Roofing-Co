'use server'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { revalidatePath } from 'next/cache'
import { db, schema } from '@/server/db'
import { requireUser } from '@/server/auth/session'

const MEDIA_DIR = path.resolve(process.cwd(), 'media')

export type UploadResult = { ok: true; id: number } | { ok: false; error: string }

/** Upload a file to the media library: save to disk + create a media row. */
export async function uploadMedia(form: FormData): Promise<UploadResult> {
  await requireUser()
  const file = form.get('file') as File | null
  const alt = String(form.get('alt') || '').trim()
  if (!file || file.size === 0) return { ok: false, error: 'Choose a file to upload.' }
  if (!alt) return { ok: false, error: 'Alt text is required (for accessibility & SEO).' }

  const buf = Buffer.from(await file.arrayBuffer())

  // Sanitize the filename and de-duplicate.
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
  const base = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '-') || 'file'
  const ext = path.extname(base)
  const stem = ext ? base.slice(0, -ext.length) : base
  let filename = base
  let i = 1
  while (fs.existsSync(path.join(MEDIA_DIR, filename))) filename = `${stem}-${i++}${ext}`

  let width: number | null = null
  let height: number | null = null
  try {
    const meta = await sharp(buf).metadata()
    width = meta.width ?? null
    height = meta.height ?? null
  } catch {
    /* non-image or unreadable — still stored, just no dimensions */
  }

  fs.writeFileSync(path.join(MEDIA_DIR, filename), buf)
  const [row] = await db
    .insert(schema.media)
    .values({
      alt,
      filename,
      mimeType: file.type || 'application/octet-stream',
      filesize: buf.length,
      width,
      height,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: schema.media.id })

  revalidatePath('/manage/media')
  return { ok: true, id: row.id as number }
}
