import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import { list, del } from '@vercel/blob'
import sharp from 'sharp'
import config from './payload.config'

/**
 * Seed script. Run with: `npx tsx src/seed.ts`
 *
 * - Ensures the demo admin account exists (idempotent).
 * - Wipes + recreates all *content* (services, projects, reviews, etc.) and
 *   media so the demo always lands in a known, complete state.
 * - Generates branded placeholder images with sharp (no binary assets in repo);
 *   every one is replaceable through the admin Media library.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid Lexical editor state from plain paragraphs. */
const lexical = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [
        { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
      ],
    })),
  },
})

/** Escape text injected into SVG/XML so characters like & < > don't break parsing. */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const roofMotif = (w: number, h: number) => `
  <path d="M0 ${h * 0.66} L ${w * 0.5} ${h * 0.3} L ${w} ${h * 0.66} Z" fill="#ffffff" opacity="0.05"/>
  <path d="M ${w * 0.2} ${h * 0.57} L ${w * 0.5} ${h * 0.34} L ${w * 0.8} ${h * 0.57} L ${w * 0.8} ${h * 0.8} L ${w * 0.2} ${h * 0.8} Z" fill="#ffffff" opacity="0.05"/>
  <line x1="${w * 0.5}" y1="${h * 0.34}" x2="${w * 0.5}" y2="${h * 0.8}" stroke="#ffffff" opacity="0.04" stroke-width="2"/>`

const photoSvg = (
  label: string,
  sub: string,
  opts: { w?: number; h?: number; c1?: string; c2?: string } = {},
) => {
  const { w = 1200, h = 800, c1 = '#0b2440', c2 = '#1f5170' } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${roofMotif(w, h)}
    <text x="50%" y="49%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w * 0.055)}" font-weight="700" fill="#ffffff">${esc(label)}</text>
    <text x="50%" y="57%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w * 0.024)}" fill="#ffffff" opacity="0.72">${esc(sub)}</text>
  </svg>`
}

const logoSvg = (textColor: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="120" viewBox="0 0 460 120">
    <path d="M18 74 L52 38 L86 74" stroke="#f97316" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="104" y="60" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="${textColor}">APEX</text>
    <text x="106" y="92" font-family="Arial, sans-serif" font-size="20" letter-spacing="7" fill="${textColor}" opacity="0.85">ROOFING CO</text>
  </svg>`

const certSvg = (initials: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <circle cx="120" cy="120" r="110" fill="#102a43"/>
    <circle cx="120" cy="120" r="110" fill="none" stroke="#f97316" stroke-width="6"/>
    <text x="50%" y="46%" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">${esc(initials)}</text>
    <text x="50%" y="64%" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" letter-spacing="3" fill="#ffffff" opacity="0.8">CERTIFIED</text>
  </svg>`

const createImage = async (payload: Payload, name: string, alt: string, svg: string) => {
  const data = await sharp(Buffer.from(svg)).png().toBuffer()
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/png', name: `${name}.png`, size: data.length },
  })
  return doc.id
}

const wipe = async (payload: Payload, collections: string[]) => {
  for (const collection of collections) {
    await payload.delete({ collection: collection as 'media', where: { id: { exists: true } } })
  }
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

const seed = async () => {
  const payload = await getPayload({ config })
  console.log('[seed] Payload ready.')

  // 1) Admin account (idempotent)
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { username: 'ApexRoofing', password: 'Admin2026!' },
    })
    console.log('[seed] ✓ Created admin account: ApexRoofing')
  }

  // 2) Wipe content for a deterministic demo
  await wipe(payload, [
    'projects',
    'reviews',
    'services',
    'service-areas',
    'certifications',
    'financing-options',
    'media',
  ])
  console.log('[seed] Cleared previous content.')

  // 2b) Clear the Blob store too, so re-seeding can't collide with existing files.
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (blobToken) {
    try {
      const { blobs } = await list({ token: blobToken, limit: 1000 })
      if (blobs.length > 0) {
        await del(
          blobs.map((b) => b.url),
          { token: blobToken },
        )
      }
      console.log(`[seed] Cleared ${blobs.length} files from Blob storage.`)
    } catch (e) {
      console.warn('[seed] Blob clear skipped:', e instanceof Error ? e.message : e)
    }
  }

  // 3) Images
  const logo = await createImage(payload, 'logo', 'Apex Roofing Co logo', logoSvg('#102a43'))
  const logoLight = await createImage(payload, 'logo-light', 'Apex Roofing Co logo', logoSvg('#ffffff'))
  const hero = await createImage(
    payload,
    'hero',
    'New asphalt shingle roof on a suburban home',
    photoSvg('Apex Roofing Co', 'Quality roofing, done right', { w: 1600, h: 1000 }),
  )
  console.log('[seed] ✓ Brand images generated.')

  // 4) Services
  const serviceDefs = [
    {
      title: 'Roof Replacement',
      icon: 'roof',
      priceRange: '$8,000–$30,000',
      featured: true,
      order: 1,
      summary:
        'Full tear-off and replacement with premium architectural shingles, backed by a written workmanship warranty.',
      body: [
        'When a repair is no longer enough, a full replacement protects your home for decades. We tear off the old roof, inspect and repair the decking, and install a complete, code-compliant roofing system.',
        'Every replacement includes new underlayment, ice-and-water shield in vulnerable areas, proper ventilation, and a manufacturer-backed warranty in addition to our own workmanship guarantee.',
      ],
    },
    {
      title: 'Roof Repair',
      icon: 'repair',
      priceRange: 'From $350',
      featured: true,
      order: 2,
      summary: 'Fast, lasting repairs for leaks, missing shingles, flashing, and storm damage.',
      body: [
        'A small leak today is a major repair tomorrow. Our crews diagnose the real source of the problem — not just the symptom — and fix it right the first time.',
      ],
    },
    {
      title: 'Free Roof Inspection',
      icon: 'inspection',
      priceRange: 'Always Free',
      featured: true,
      order: 3,
      summary: 'A thorough, no-pressure 21-point inspection with honest photos and a clear report.',
      body: [
        'We document the true condition of your roof with photos and a plain-English report, so you can make an informed decision with zero pressure.',
      ],
    },
    {
      title: 'Gutter Installation & Repair',
      icon: 'gutters',
      priceRange: 'From $1,200',
      featured: false,
      order: 4,
      summary: 'Seamless gutters and guards that move water away from your roof and foundation.',
      body: ['Properly sized, seamless aluminum gutters protect your fascia, siding, and foundation year-round.'],
    },
    {
      title: 'Storm & Hail Damage',
      icon: 'storm',
      priceRange: 'Insurance-Based',
      featured: true,
      order: 5,
      summary: 'Storm damage specialists who guide you through the entire insurance claim process.',
      body: [
        'Hail and wind damage is not always visible from the ground. We inspect, document, and work directly with your insurance adjuster to make sure your claim is fair and complete.',
      ],
    },
    {
      title: 'Commercial Roofing',
      icon: 'commercial',
      priceRange: 'Custom Quote',
      featured: false,
      order: 6,
      summary: 'TPO, EPDM, and metal systems for flat and low-slope commercial buildings.',
      body: ['Minimize downtime and protect your investment with durable, energy-efficient commercial roofing systems.'],
    },
  ]

  const serviceIds: Record<string, number | string> = {}
  for (const s of serviceDefs) {
    const img = await createImage(
      payload,
      `service-${s.icon}`,
      `${s.title} service`,
      photoSvg(s.title, 'Apex Roofing Co', { c1: '#0b2440', c2: '#27567a' }),
    )
    const doc = await payload.create({
      collection: 'services',
      data: {
        title: s.title,
        summary: s.summary,
        description: lexical(s.body),
        priceRange: s.priceRange,
        icon: s.icon as 'roof',
        image: img,
        featured: s.featured,
        order: s.order,
      },
    })
    serviceIds[s.icon] = doc.id
  }
  console.log('[seed] ✓ Services created.')

  // 5) Reviews
  const reviewDefs = [
    { author: 'Marcus Bellamy', rating: 5, location: 'Cedar Park, TX', service: 'roof', featured: true, text: 'Apex replaced our roof after a hailstorm and handled the entire insurance claim. The crew was on time, spotless, and done in two days. Best contractor experience we have had.' },
    { author: 'Janelle Ortiz', rating: 5, location: 'Round Rock, TX', service: 'storm', featured: true, text: 'They found hail damage three other companies missed, documented everything, and our claim was approved. Honest and genuinely helpful from start to finish.' },
    { author: 'David Cho', rating: 5, location: 'Leander, TX', service: 'repair', featured: true, text: 'Had a stubborn leak two other roofers could not solve. Apex found the real source in fifteen minutes and fixed it for a fair price. Highly recommend.' },
    { author: 'Priya Raman', rating: 5, location: 'Georgetown, TX', service: 'roof', featured: true, text: 'Beautiful new roof and the cleanup was immaculate — you would never know a crew had been here. The warranty paperwork was clear and complete.' },
    { author: 'Tom Whitaker', rating: 4, location: 'Austin, TX', service: 'gutters', featured: false, text: 'Great seamless gutters, fairly priced. Scheduling took a little back-and-forth but the install was excellent.' },
    { author: 'Sandra Lee', rating: 5, location: 'Cedar Park, TX', service: 'inspection', featured: false, text: 'The free inspection was genuinely free and genuinely thorough. No scare tactics, just honest photos and advice. We will use them when we are ready to replace.' },
    { author: 'Greg Mathers', rating: 5, location: 'Pflugerville, TX', service: 'roof', featured: false, text: 'Second roof Apex has done for me across two homes. Same quality and professionalism both times. That consistency is why I keep calling them.' },
    { author: 'Alicia Fontaine', rating: 5, location: 'Round Rock, TX', service: 'commercial', featured: false, text: 'Re-roofed our office with TPO over a long weekend so we never lost a business day. Clean, communicative, and on budget.' },
  ]

  const reviewIds: Record<string, number | string> = {}
  for (const r of reviewDefs) {
    const doc = await payload.create({
      collection: 'reviews',
      data: {
        author: r.author,
        rating: r.rating,
        text: r.text,
        location: r.location,
        source: 'Google',
        service: serviceIds[r.service],
        featured: r.featured,
        date: new Date(2025, 10, 1).toISOString(),
      },
    })
    reviewIds[r.author] = doc.id
  }
  console.log('[seed] ✓ Reviews created.')

  // 6) Projects (before / after)
  const projectDefs = [
    { title: 'Full Architectural Shingle Replacement', city: 'Cedar Park, TX', service: 'roof', review: 'Marcus Bellamy', featured: true, desc: 'Complete tear-off and replacement with weathered-wood architectural shingles after hail damage.' },
    { title: 'Storm Damage Restoration', city: 'Round Rock, TX', service: 'storm', review: 'Janelle Ortiz', featured: true, desc: 'Insurance-approved full restoration following a severe spring hailstorm.' },
    { title: 'Standing-Seam Metal Roof', city: 'Georgetown, TX', service: 'roof', review: 'Priya Raman', featured: true, desc: 'Charcoal standing-seam metal roof installed for durability and modern curb appeal.' },
    { title: 'Leak Repair & Flashing Rebuild', city: 'Leander, TX', service: 'repair', review: 'David Cho', featured: false, desc: 'Chimney flashing rebuilt and valley re-shingled to stop a long-standing leak.' },
    { title: 'Seamless Gutter Installation', city: 'Austin, TX', service: 'gutters', review: null, featured: false, desc: 'New seamless aluminum gutters and leaf guards around the full perimeter.' },
    { title: 'Commercial TPO Re-Roof', city: 'Round Rock, TX', service: 'commercial', review: 'Alicia Fontaine', featured: false, desc: 'Low-slope commercial building re-roofed with energy-efficient white TPO membrane.' },
  ]

  for (const p of projectDefs) {
    const before = await createImage(payload, `before-${p.service}-${p.city}`, `${p.title} — before`, photoSvg('BEFORE', p.title, { c1: '#3a3f47', c2: '#5b6470' }))
    const after = await createImage(payload, `after-${p.service}-${p.city}`, `${p.title} — after`, photoSvg('AFTER', p.title, { c1: '#0b2440', c2: '#27567a' }))
    await payload.create({
      collection: 'projects',
      data: {
        title: p.title,
        service: serviceIds[p.service],
        city: p.city,
        completedDate: new Date(2025, 9, 15).toISOString(),
        beforeImage: before,
        afterImage: after,
        description: p.desc,
        linkedReview: p.review ? reviewIds[p.review] : undefined,
        featured: p.featured,
      },
    })
  }
  console.log('[seed] ✓ Projects created.')

  // 7) Service areas
  const areaDefs = [
    { city: 'Cedar Park', featured: true, intro: 'Our home base. Fast response and same-week inspections across Cedar Park.' },
    { city: 'Round Rock', featured: true, intro: 'Trusted roof replacement, repair, and storm restoration throughout Round Rock.' },
    { city: 'Leander', featured: true, intro: 'Local crews serving Leander with honest inspections and quality workmanship.' },
    { city: 'Georgetown', featured: false, intro: 'Premium roofing and metal roof installation across the Georgetown area.' },
    { city: 'Austin', featured: false, intro: 'Residential and commercial roofing services across the greater Austin area.' },
  ]
  for (const a of areaDefs) {
    await payload.create({
      collection: 'service-areas',
      data: {
        city: a.city,
        state: 'TX',
        intro: a.intro,
        featured: a.featured,
        content: lexical([
          `${a.city} homeowners trust Apex Roofing Co for roof replacement, repair, and storm-damage restoration. As a local, licensed, and insured contractor, we know the weather and the building codes in ${a.city} — and we stand behind every roof we install with a written workmanship warranty.`,
        ]),
      },
    })
  }
  console.log('[seed] ✓ Service areas created.')

  // 8) Certifications
  const certDefs = [
    { name: 'GAF Master Elite®', initials: 'GAF', description: 'Only the top 2% of roofers earn this — it lets us offer GAF\'s strongest warranties.' },
    { name: 'Owens Corning Preferred', initials: 'OC', description: 'Factory-trained installation that protects your manufacturer warranty.' },
    { name: 'BBB A+ Accredited', initials: 'A+', description: 'An A+ rating from the Better Business Bureau for trust and resolution.' },
    { name: 'CertainTeed ShingleMaster™', initials: 'CT', description: 'Credentialed for advanced roofing systems and extended warranty coverage.' },
  ]
  for (let i = 0; i < certDefs.length; i++) {
    const c = certDefs[i]
    const logoId = await createImage(payload, `cert-${c.initials}`, `${c.name} badge`, certSvg(c.initials))
    await payload.create({
      collection: 'certifications',
      data: { name: c.name, description: c.description, logo: logoId, order: i + 1 },
    })
  }
  console.log('[seed] ✓ Certifications created.')

  // 9) Financing options
  const finDefs = [
    { name: '0% APR for 12 Months', terms: 'No interest if paid in full within 12 months', description: 'Spread the cost of your new roof interest-free for a full year.', order: 1 },
    { name: '60-Month Low Payment Plan', terms: 'Low fixed monthly payments', description: 'Predictable, budget-friendly payments with quick approval.', order: 2 },
    { name: 'No Money Down', terms: '$0 down to get started', description: 'Start your project now and begin payments later.', order: 3 },
  ]
  for (const f of finDefs) {
    await payload.create({ collection: 'financing-options', data: f })
  }
  console.log('[seed] ✓ Financing options created.')

  // 10) Globals
  await payload.updateGlobal({
    slug: 'branding',
    data: { logo, logoLight, favicon: logo, primaryColor: '#102a43', accentColor: '#f97316' },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      hours: [
        { days: 'Mon – Fri', time: '7:00 AM – 6:00 PM' },
        { days: 'Saturday', time: '8:00 AM – 2:00 PM' },
        { days: 'Sunday', time: 'Emergencies only' },
      ],
      social: {
        google: 'https://g.page/apex-roofing-co',
        facebook: 'https://facebook.com/apexroofingco',
        instagram: 'https://instagram.com/apexroofingco',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: { backgroundImage: hero },
      whyUs: [
        { title: 'Free, No-Pressure Inspections', description: 'An honest 21-point assessment with photos — never a sales ambush.' },
        { title: 'Licensed, Bonded & Insured', description: 'Fully credentialed crews and a written workmanship warranty on every job.' },
        { title: 'Insurance Claim Experts', description: 'We document damage and work directly with your adjuster for a fair claim.' },
        { title: 'Local & Responsive', description: '18+ years serving the area, with same-week inspection scheduling.' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'financing-info',
    data: {
      insuranceClaimHelp: lexical([
        'Storm damage is stressful — the claim process should not be. Our team inspects your roof, documents every point of damage with photographs, and meets your insurance adjuster on site to make sure nothing is missed.',
        'You pay your deductible; we handle the paperwork and the roof. Most approved claims move from inspection to a finished roof in under three weeks.',
      ]),
    },
  })
  console.log('[seed] ✓ Globals updated.')

  console.log('[seed] Done — demo content is ready.')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] FAILED:', err)
    process.exit(1)
  })
