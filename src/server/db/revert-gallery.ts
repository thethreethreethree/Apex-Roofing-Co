import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { eq } from 'drizzle-orm'
import { db, client, schema } from './index'

/**
 * REVERT of a mistake in recolor-images.ts: it repointed project AFTER images to
 * pink placeholder gradients, but those were REAL owner-uploaded photos
 * (gallery-N-after.jpg). Restore the media rows to the original filenames (files
 * are still on disk) and delete the wrongly-generated -p.png placeholders.
 * Run on the server: `npx tsx src/server/db/revert-gallery.ts`
 */
const MEDIA_DIR = path.resolve(process.cwd(), 'media')

async function main() {
  const media = await db.select().from(schema.media)
  for (const m of media) {
    const match = m.filename.match(/^(gallery-.*)-p\.png$/)
    if (!match) continue
    const orig = match[1] // e.g. gallery-1-after.jpg
    const origPath = path.join(MEDIA_DIR, orig)
    if (!fs.existsSync(origPath)) {
      console.log(`! original missing, NOT reverting: ${orig}`)
      continue
    }
    const size = fs.statSync(origPath).size
    await db.update(schema.media).set({ filename: orig, filesize: size, updatedAt: new Date() }).where(eq(schema.media.id, m.id))
    const placeholderPath = path.join(MEDIA_DIR, m.filename)
    if (fs.existsSync(placeholderPath)) fs.unlinkSync(placeholderPath)
    console.log(`reverted ${m.filename} -> ${orig} (${size} bytes)`)
  }
  client.close()
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
