import fs from 'node:fs'
import path from 'node:path'

/**
 * Custom media serving route for the custom backend — serves uploaded files from
 * <project>/media by filename. Public (media is public content). Path-traversal
 * safe (only a bare filename inside the media dir is served).
 */
const MEDIA_DIR = path.resolve(process.cwd(), 'media')

const TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  const safe = path.basename(filename)
  if (safe !== filename || safe.includes('..')) return new Response('Not found', { status: 404 })

  const filePath = path.join(MEDIA_DIR, safe)
  if (!filePath.startsWith(MEDIA_DIR + path.sep) || !fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 })
  }

  const file = fs.readFileSync(filePath)
  const type = TYPES[path.extname(safe).toLowerCase()] ?? 'application/octet-stream'
  return new Response(new Uint8Array(file), {
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
