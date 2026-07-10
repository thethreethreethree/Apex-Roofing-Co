'use server'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { revalidatePath } from 'next/cache'
import { db, schema } from '@/server/db'
import { requireUser } from '@/server/auth/session'

const MEDIA_DIR = path.resolve(process.cwd(), 'media')

// Content-based allowlist (audit F2). We validate the DECODED image format via
// sharp — not the client-supplied MIME — and reject SVG (which can carry active
// content) and anything sharp can't parse as a raster image.
const ALLOWED_FORMATS = new Set(['png', 'jpeg', 'webp', 'gif', 'avif'])
const FORMAT_MIME: Record<string, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
}

export type UploadResult = { ok: true; id: number } | { ok: false; error: string }

/** Upload a file to the media library: validate, save to disk + create a media row. */
export async function uploadMedia(form: FormData): Promise<UploadResult> {
  await requireUser()
  const file = form.get('file') as File | null
  const alt = String(form.get('alt') || '').trim()
  if (!file || file.size === 0) return { ok: false, error: 'Choose a file to upload.' }
  if (!alt) return { ok: false, error: 'Alt text is required (for accessibility & SEO).' }

  const buf = Buffer.from(await file.arrayBuffer())

  // Validate the actual decoded image (rejects SVG + non-images).
  let meta: sharp.Metadata
  try {
    meta = await sharp(buf).metadata()
  } catch {
    return { ok: false, error: 'That file could not be read as an image.' }
  }
  if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) {
    return { ok: false, error: 'Only PNG, JPEG, WebP, GIF, or AVIF images are allowed.' }
  }

  // Sanitize the filename and de-duplicate.
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
  const base = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '-') || 'file'
  const ext = path.extname(base)
  const stem = ext ? base.slice(0, -ext.length) : base
  let filename = base
  let i = 1
  while (fs.existsSync(path.join(MEDIA_DIR, filename))) filename = `${stem}-${i++}${ext}`

  fs.writeFileSync(path.join(MEDIA_DIR, filename), buf)
  const [row] = await db
    .insert(schema.media)
    .values({
      alt,
      filename,
      // Trust the validated format, not the client-supplied file.type.
      mimeType: FORMAT_MIME[meta.format] ?? 'application/octet-stream',
      filesize: buf.length,
      width: meta.width ?? null,
      height: meta.height ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: schema.media.id })

  revalidatePath('/manage/media')
  return { ok: true, id: row.id as number }
}
