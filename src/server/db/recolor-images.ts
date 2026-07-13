import 'dotenv/config'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { eq } from 'drizzle-orm'
import { db, client, schema } from './index'

/**
 * One-off: recolour the seeded teal/orange placeholder IMAGES to the pink brand,
 * and guard the Branding global's primaryColor/accentColor (which layout.tsx
 * injects site-wide as --brand/--accent). Renames each image (…-p.png) so the
 * `immutable, max-age=1yr` cache header can't keep serving teal.
 * Run on the server: `npx tsx src/server/db/recolor-images.ts`
 */
const MEDIA_DIR = path.resolve(process.cwd(), 'media')
const PINK = { c1: '#4a2360', c2: '#e84c9a' }

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const pawMotif = (w: number, h: number) => {
  const r = h * 0.085, t = r * 0.42, cx = w * 0.5, cy = h * 0.54
  return `<g fill="#ffffff" opacity="0.06"><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.85}"/><circle cx="${cx - r}" cy="${cy - r * 0.9}" r="${t}"/><circle cx="${cx - r * 0.38}" cy="${cy - r * 1.35}" r="${t}"/><circle cx="${cx + r * 0.38}" cy="${cy - r * 1.35}" r="${t}"/><circle cx="${cx + r}" cy="${cy - r * 0.9}" r="${t}"/></g>`
}

const photoSvg = (label: string, sub: string, opts: { w?: number; h?: number; c1?: string; c2?: string } = {}) => {
  const { w = 1200, h = 800, c1 = PINK.c1, c2 = PINK.c2 } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>${pawMotif(w, h)}<text x="50%" y="49%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w * 0.05)}" font-weight="700" fill="#ffffff">${esc(label)}</text><text x="50%" y="57%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w * 0.022)}" fill="#ffffff" opacity="0.72">${esc(sub)}</text></svg>`
}

const logoSvg = (textColor: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="120" viewBox="0 0 520 120"><g fill="#e84c9a"><ellipse cx="52" cy="70" rx="17" ry="15"/><circle cx="33" cy="52" r="7"/><circle cx="45" cy="42" r="7"/><circle cx="59" cy="42" r="7"/><circle cx="71" cy="52" r="7"/></g><text x="98" y="58" font-family="Arial, sans-serif" font-size="36" font-weight="800" fill="${textColor}">SHAGGY DOG SPA</text><text x="100" y="90" font-family="Arial, sans-serif" font-size="19" letter-spacing="6" fill="${textColor}" opacity="0.85">MOBILE GROOMING</text></svg>`

async function recolor(mediaId: number, svg: string, tag: string, mediaById: Map<number, string>) {
  const cur = mediaById.get(mediaId)
  if (!cur) { console.log(`  ! media ${mediaId} (${tag}) not found`); return }
  if (/-p\.png$/.test(cur)) { console.log(`  = ${cur} (${tag}) already recoloured, skip`); return }
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  const newName = `${cur.replace(/\.png$/, '')}-p.png`
  fs.writeFileSync(path.join(MEDIA_DIR, newName), png)
  await db.update(schema.media).set({ filename: newName, filesize: png.length, updatedAt: new Date() }).where(eq(schema.media.id, mediaId))
  console.log(`  ${cur} -> ${newName} (${tag})`)
}

async function main() {
  // A.1 — guard the site-wide palette
  const [b] = await db.select().from(schema.branding).limit(1)
  console.log(`branding: primary=${b?.primaryColor} accent=${b?.accentColor}`)
  if (b && (b.primaryColor !== '#4a2360' || b.accentColor !== '#e84c9a')) {
    await db.update(schema.branding).set({ primaryColor: '#4a2360', accentColor: '#e84c9a' }).where(eq(schema.branding.id, b.id))
    console.log('  -> branding updated to pink (#4a2360 / #e84c9a)')
  } else {
    console.log('  = branding already pink')
  }

  const media = await db.select().from(schema.media)
  const byId = new Map(media.map((m) => [m.id, m.filename]))

  // A.2 — service detail images
  const services = await db.select().from(schema.services)
  for (const s of services) if (s.imageId) await recolor(s.imageId, photoSvg(s.title, 'Shaggy Doggy Spa'), `service:${s.title}`, byId)

  // A.2 — project AFTER images (before-* stays grey by design)
  const projects = await db.select().from(schema.projects)
  for (const p of projects) if (p.afterImageId) await recolor(p.afterImageId, photoSvg('AFTER', p.title), `after:${p.title}`, byId)

  // orphaned-but-cheap: hero + logo placeholders
  const heroRow = media.find((m) => m.filename === 'hero.png')
  if (heroRow) await recolor(heroRow.id, photoSvg('Shaggy Doggy Spa', 'Mobile grooming that comes to you', { w: 1600, h: 1000 }), 'hero', byId)
  const logoRow = media.find((m) => m.filename === 'logo.png')
  if (logoRow) await recolor(logoRow.id, logoSvg('#4a2360'), 'logo', byId)

  client.close()
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })
