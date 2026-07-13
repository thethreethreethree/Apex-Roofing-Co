import 'dotenv/config'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { eq } from 'drizzle-orm'
import { db, client, schema } from './index'

/**
 * One-off: recolour the seeded certification badges from the old teal/orange
 * (#0e4653 / #f2994a) to the pink brand (fill #e84c9a, plum ring #4a2360, white
 * text). Renames each file (badge-N.png -> badge-N-p.png) and updates the media
 * row so the `immutable, max-age=1yr` cache header can't keep serving teal.
 * Run on the server: `npx tsx src/server/db/recolor-badges.ts`
 */
const MEDIA_DIR = path.resolve(process.cwd(), 'media')

const badgeSvg = (initials: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><circle cx="120" cy="120" r="110" fill="#e84c9a"/><circle cx="120" cy="120" r="110" fill="none" stroke="#4a2360" stroke-width="6"/><text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">${initials}</text></svg>`

// The initials are baked into the PNGs, not stored in the DB — map by filename.
const INITIALS: Record<string, string> = {
  'badge-0.png': 'VAN',
  'badge-1.png': '1:1',
  'badge-2.png': 'TLC',
  'badge-3.png': 'INS',
}

async function main() {
  const certs = await db.select().from(schema.certifications)
  const media = await db.select().from(schema.media)
  const byId = new Map(media.map((m) => [m.id, m.filename]))
  console.log('--- current cert -> badge mapping (verify before trusting) ---')
  for (const c of certs) console.log(`CERT "${c.name}" logoId=${c.logoId} file=${byId.get(c.logoId as number)}`)

  console.log('--- recolouring ---')
  for (const m of media) {
    const initials = INITIALS[m.filename]
    if (!initials) continue
    const png = await sharp(Buffer.from(badgeSvg(initials))).png().toBuffer()
    const newName = `${m.filename.replace(/\.png$/, '')}-p.png`
    fs.writeFileSync(path.join(MEDIA_DIR, newName), png)
    await db
      .update(schema.media)
      .set({ filename: newName, filesize: png.length, updatedAt: new Date() })
      .where(eq(schema.media.id, m.id))
    console.log(`  ${m.filename} -> ${newName} (${initials})`)
  }
  client.close()
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
