import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'
import config from './payload.config'

/**
 * Seed script. Run with: `npx tsx src/seed.ts`
 *
 * - Ensures the demo admin account exists (idempotent).
 * - Wipes + recreates all *content* (services, projects, reviews, etc.) and
 *   media so the demo always lands in a known, complete state.
 * - Generates branded placeholder images with sharp (no binary assets in repo);
 *   every one is replaceable through the admin Media library. These are on-brand
 *   paw-motif placeholders, NOT real photos — swap in real grooming photos in admin.
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

/** Subtle paw-print motif for placeholder image backgrounds. */
const pawMotif = (w: number, h: number) => {
  const r = h * 0.085
  const t = r * 0.42
  const cx = w * 0.5
  const cy = h * 0.54
  return `
  <g fill="#ffffff" opacity="0.06">
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.85}"/>
    <circle cx="${cx - r}" cy="${cy - r * 0.9}" r="${t}"/>
    <circle cx="${cx - r * 0.38}" cy="${cy - r * 1.35}" r="${t}"/>
    <circle cx="${cx + r * 0.38}" cy="${cy - r * 1.35}" r="${t}"/>
    <circle cx="${cx + r}" cy="${cy - r * 0.9}" r="${t}"/>
  </g>`
}

const photoSvg = (
  label: string,
  sub: string,
  opts: { w?: number; h?: number; c1?: string; c2?: string } = {},
) => {
  const { w = 1200, h = 800, c1 = '#0e4653', c2 = '#1c5f6b' } = opts
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    ${pawMotif(w, h)}
    <text x="50%" y="49%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w * 0.05)}" font-weight="700" fill="#ffffff">${esc(label)}</text>
    <text x="50%" y="57%" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w * 0.022)}" fill="#ffffff" opacity="0.72">${esc(sub)}</text>
  </svg>`
}

/** Wordmark logo: a paw glyph + business name. */
const logoSvg = (textColor: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="120" viewBox="0 0 520 120">
    <g fill="#f2994a">
      <ellipse cx="52" cy="70" rx="17" ry="15"/>
      <circle cx="33" cy="52" r="7"/>
      <circle cx="45" cy="42" r="7"/>
      <circle cx="59" cy="42" r="7"/>
      <circle cx="71" cy="52" r="7"/>
    </g>
    <text x="98" y="58" font-family="Arial, sans-serif" font-size="36" font-weight="800" fill="${textColor}">SHAGGY DOG SPA</text>
    <text x="100" y="90" font-family="Arial, sans-serif" font-size="19" letter-spacing="6" fill="${textColor}" opacity="0.85">MOBILE GROOMING</text>
  </svg>`

/** Round badge with short initials (soft trust badge, not a formal certification). */
const badgeSvg = (initials: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <circle cx="120" cy="120" r="110" fill="#0e4653"/>
    <circle cx="120" cy="120" r="110" fill="none" stroke="#f2994a" stroke-width="6"/>
    <text x="50%" y="56%" text-anchor="middle" font-family="Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">${esc(initials)}</text>
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
      data: { username: 'ShaggyDogSpa', password: 'Admin2026!' },
    })
    console.log('[seed] ✓ Created admin account: ShaggyDogSpa')
  }

  // 2) Wipe content for a deterministic demo
  await wipe(payload, [
    'projects',
    'reviews',
    'services',
    'certifications',
    'financing-options',
    'media',
  ])
  console.log('[seed] Cleared previous content.')

  // 3) Images (branded paw-motif placeholders — replace with real photos in admin)
  const logo = await createImage(payload, 'logo', 'Shaggy Dog Spa Mobile Grooming logo', logoSvg('#0e4653'))
  const logoLight = await createImage(payload, 'logo-light', 'Shaggy Dog Spa Mobile Grooming logo', logoSvg('#ffffff'))
  const hero = await createImage(
    payload,
    'hero',
    'A freshly groomed, happy dog',
    photoSvg('Shaggy Dog Spa', 'Mobile grooming that comes to you', { w: 1600, h: 1000 }),
  )
  console.log('[seed] ✓ Brand images generated.')

  // 4) Services
  const serviceDefs = [
    {
      title: 'Full Groom',
      icon: 'groom',
      priceRange: 'From $75',
      featured: true,
      order: 1,
      summary:
        'Bath, breed-style haircut, nail trim, ear cleaning, and a finishing spritz — all at your curb.',
      body: [
        'Our signature service: a warm bath with pet-safe shampoo, a full haircut styled to your breed or your preference, nails trimmed and smoothed, ears cleaned, and a light finishing spray so your pet goes back inside soft, tidy, and fresh.',
        'Every full groom happens one-on-one inside our mobile van — no cages, no cage dryers, and no long day at a salon. Final price depends on your pet’s size, coat, and condition, and we confirm the quote before we start.',
      ],
    },
    {
      title: 'Bath & Brush',
      icon: 'bath',
      priceRange: 'From $45',
      featured: true,
      order: 2,
      summary: 'Warm bath, blow-dry, thorough brush-out, nails, and ears — perfect between full grooms.',
      body: [
        'A clean-up service for pets who hold their style well: a warm bath, gentle blow-dry, complete brush-out to remove loose fur, plus nails and ears. Keeps your pet fresh between full grooms.',
      ],
    },
    {
      title: 'Deshedding Package',
      icon: 'deshed',
      priceRange: 'From $65',
      featured: true,
      order: 3,
      summary: 'Deep deshed treatment that cuts loose fur and shedding for double-coated and heavy shedders.',
      body: [
        'Built for huskies, shepherds, retrievers, and other heavy shedders: a deshedding bath and treatment plus a specialized brush-out that pulls out the loose undercoat before it ends up all over your home.',
      ],
    },
    {
      title: 'Nail Trim & Grind',
      icon: 'nails',
      priceRange: 'From $20',
      featured: true,
      order: 4,
      summary: 'Quick, low-stress nail trim and a smooth grind — gentle even for pets who hate their feet touched.',
      body: [
        'A fast, calm nail trim followed by a grind to smooth every edge so there are no sharp tips or snags. Great as an add-on to any service or as a quick standalone visit.',
      ],
    },
    {
      title: 'Flea & Tick Treatment',
      icon: 'flea',
      priceRange: 'Add-on $25',
      featured: false,
      order: 5,
      summary: 'A medicated bath add-on to knock down fleas and ticks, plus a careful coat check.',
      body: [
        'A medicated flea-and-tick bath that can be added to any groom, along with a thorough coat and skin check so nothing gets missed. Ask us to add it when you book.',
      ],
    },
    {
      title: 'Cat Grooming',
      icon: 'cat',
      priceRange: 'From $70',
      featured: false,
      order: 6,
      summary: 'Gentle, patient grooming for cats — bath, deshed, nails, and a tidy-up by request.',
      body: [
        'Cats deserve calm, careful handling. We offer bathing, deshedding, nail trims, and light tidy-ups for cats, worked at your cat’s pace to keep stress as low as possible.',
      ],
    },
  ]

  const serviceIds: Record<string, number | string> = {}
  for (const s of serviceDefs) {
    const img = await createImage(
      payload,
      `service-${s.icon}`,
      `${s.title}`,
      photoSvg(s.title, 'Shaggy Dog Spa', { c1: '#0e4653', c2: '#20707e' }),
    )
    const doc = await payload.create({
      collection: 'services',
      data: {
        title: s.title,
        summary: s.summary,
        description: lexical(s.body),
        priceRange: s.priceRange,
        icon: s.icon as 'groom',
        image: img,
        featured: s.featured,
        order: s.order,
      },
    })
    serviceIds[s.icon] = doc.id
  }
  console.log('[seed] ✓ Services created.')

  // 5) Reviews
  // NOTE: representative placeholder reviews modeled on the real Yelp listing's
  // themes (gentle with senior pets, low-stress, mobile convenience, groomers
  // Adam & Frank). Replace with the business's actual reviews in admin.
  const reviewDefs = [
    { author: 'Denise M.', rating: 5, service: 'groom', featured: true, text: 'Adam showed up right on time and groomed our 9-year-old Doberman with so much care. She’s usually nervous at the salon but stayed calm the whole time. The van is spotless and she came back looking amazing.' },
    { author: 'Robert T.', rating: 5, service: 'cat', featured: true, text: 'They groomed our 18-year-old Papillon and were far more concerned about keeping her stress low than rushing through it. You can tell they genuinely love animals. Completely satisfied.' },
    { author: 'Marisol A.', rating: 5, service: 'deshed', featured: true, text: 'Our husky sheds like crazy and the deshedding package made a night-and-day difference — our whole house is cleaner. Booking was easy and they came right to us.' },
    { author: 'Kevin D.', rating: 5, service: 'groom', featured: true, text: 'No more fighting the crate and driving across town. They pull up, groom, and our doodle comes back fluffy and happy. Worth every penny for the convenience alone.' },
    { author: 'Priya S.', rating: 5, service: 'nails', featured: false, text: 'Frank has been our groomer for about two years now and both our maltipoo and mini terrier adore him. Consistent, kind, and always right on schedule.' },
    { author: 'Tom W.', rating: 4, service: 'bath', featured: false, text: 'Great bath and brush at a fair price. Scheduling took a little back-and-forth, but the groom itself was excellent and very gentle with our older dog.' },
    { author: 'Sandra L.', rating: 5, service: 'flea', featured: false, text: 'They caught the start of a flea problem during a bath and handled it that same visit. Honest and thorough — never tried to upsell me on things we didn’t need.' },
    { author: 'Greg M.', rating: 5, service: 'groom', featured: false, text: 'Second dog I’ve had groomed with them and it’s the same gentle, careful quality every time. That consistency is exactly why I keep booking.' },
  ]

  const reviewIds: Record<string, number | string> = {}
  for (const r of reviewDefs) {
    const doc = await payload.create({
      collection: 'reviews',
      data: {
        author: r.author,
        rating: r.rating,
        text: r.text,
        source: 'Yelp',
        service: serviceIds[r.service],
        featured: r.featured,
        date: new Date(2025, 10, 1).toISOString(),
      },
    })
    reviewIds[r.author] = doc.id
  }
  console.log('[seed] ✓ Reviews created.')

  // 6) Projects (before / after grooming transformations)
  const projectDefs = [
    { title: 'Matted Doodle Full Makeover', service: 'groom', review: 'Denise M.', featured: true, desc: 'A heavily matted goldendoodle brought back to a soft, even teddy-bear trim.' },
    { title: 'Senior Dog Gentle Deshed', service: 'deshed', review: 'Marisol A.', featured: true, desc: 'Low-stress deshedding for a senior husky — pounds of loose undercoat removed.' },
    { title: 'Nervous Rescue’s First Groom', service: 'groom', review: 'Robert T.', featured: true, desc: 'A shy rescue’s very first full groom, taken slow and finished calm and clean.' },
    { title: 'Double-Coat Deshed & Tidy', service: 'deshed', review: null, featured: false, desc: 'A German shepherd deshedded and neatened up right before summer.' },
    { title: 'Puppy’s First Bath & Tidy', service: 'bath', review: null, featured: false, desc: 'A puppy’s gentle first introduction to the bath, dryer, and nail trim.' },
    { title: 'Long-Haired Cat Comfort Groom', service: 'cat', review: null, featured: false, desc: 'A patient bath and deshed for a long-haired cat who hates the carrier.' },
  ]

  for (let pi = 0; pi < projectDefs.length; pi++) {
    const p = projectDefs[pi]
    const before = await createImage(payload, `before-${pi}`, `${p.title} — before`, photoSvg('BEFORE', p.title, { c1: '#3a3f47', c2: '#5b6470' }))
    const after = await createImage(payload, `after-${pi}`, `${p.title} — after`, photoSvg('AFTER', p.title, { c1: '#0e4653', c2: '#20707e' }))
    await payload.create({
      collection: 'projects',
      data: {
        title: p.title,
        service: serviceIds[p.service],
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

  // 7) Trust badges (stored in the "certifications" collection — soft, non-credential
  //    trust signals for a mobile groomer, not formal certifications).
  const badgeDefs = [
    { name: 'We Come to You', initials: 'VAN', description: 'Fully mobile — we groom right outside your door, on your schedule.' },
    { name: 'One-on-One, No Cages', initials: '1:1', description: 'Your pet is the only one in the van — never cage-dried or left waiting.' },
    { name: 'Gentle with Seniors & Puppies', initials: 'TLC', description: 'Patient, low-stress handling for anxious, senior, and first-time pets.' },
    { name: 'Insured & Reliable', initials: 'INS', description: 'Insured mobile grooming with on-time appointments you can count on.' },
  ]
  for (let i = 0; i < badgeDefs.length; i++) {
    const b = badgeDefs[i]
    const logoId = await createImage(payload, `badge-${i}`, `${b.name} badge`, badgeSvg(b.initials))
    await payload.create({
      collection: 'certifications',
      data: { name: b.name, description: b.description, logo: logoId, order: i + 1 },
    })
  }
  console.log('[seed] ✓ Trust badges created.')

  // 9) Grooming packages (stored in the "financing-options" collection, repurposed
  //    as Packages & Pricing — name = package, terms = price, description = included).
  const pkgDefs = [
    { name: 'The Full Groom', terms: 'From $75', description: 'Bath, breed-style haircut, nail trim, ear cleaning, and a finishing spritz.', order: 1 },
    { name: 'Bath & Brush', terms: 'From $45', description: 'Warm bath, blow-dry, thorough brush-out, nails, and ears — perfect between full grooms.', order: 2 },
    { name: 'Deshed Deluxe', terms: 'From $65', description: 'Deep deshedding treatment plus a full bath and tidy for heavy, double-coated shedders.', order: 3 },
    { name: 'À La Carte Add-Ons', terms: 'From $20', description: 'Nail trim & grind, ear cleaning, teeth brushing, and flea & tick treatment.', order: 4 },
  ]
  for (const f of pkgDefs) {
    await payload.create({ collection: 'financing-options', data: f })
  }
  console.log('[seed] ✓ Packages created.')

  // 10) Globals
  await payload.updateGlobal({
    slug: 'branding',
    data: { logo, logoLight, favicon: logo, primaryColor: '#1c5f6b', accentColor: '#f2994a' },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: 'Shaggy Dog Spa Mobile Grooming',
      tagline: 'Grooming That Comes to You',
      phone: '(760) 269-6239',
      emergencyPhone: '',
      email: 'hello@shaggydogspa.example',
      address: { street: '', city: 'Phelan', state: 'CA', zip: '92371' },
      license: '',
      insuranceStatement: 'Insured mobile grooming',
      yearsInBusiness: null,
      googleRating: 5,
      googleReviewCount: 26,
      hours: [
        { days: 'Monday', time: 'Closed' },
        { days: 'Tue – Sat', time: '9:00 AM – 6:00 PM' },
        { days: 'Sunday', time: 'Closed' },
      ],
      social: {
        google: '',
        facebook: 'https://facebook.com/shaggydoggyspa',
        instagram: 'https://instagram.com/shaggydoggyspa',
        yelp: 'https://www.yelp.com/biz/shaggy-dog-spa-mobile-grooming-phelan',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        heading: 'Mobile Dog & Cat Grooming That Comes to You',
        subheading:
          'Professional, low-stress grooming right in your driveway across Phelan and the High Desert. One pet at a time — no cages, no car rides — just a happy, fresh-smelling pet.',
        backgroundImage: hero,
        primaryCtaLabel: 'Book an Appointment',
        secondaryCtaLabel: 'See Packages & Pricing',
      },
      trustBadges: [
        { label: 'Fully Mobile' },
        { label: 'One Pet at a Time' },
        { label: 'Gentle & Low-Stress' },
        { label: 'Serving the High Desert' },
      ],
      whyUs: [
        { title: 'Fully Mobile', description: 'We bring the full grooming salon to your driveway — no crating, no car rides, and no waiting room.' },
        { title: 'One Pet at a Time', description: 'Your dog or cat gets our full attention from start to finish — calm, unhurried, and never cage-dried.' },
        { title: 'Gentle with Every Pet', description: 'Patient, low-stress handling for seniors, puppies, and anxious pets who dread the salon.' },
        { title: 'Local & Reliable', description: 'Serving Phelan and the High Desert with on-time appointments you can count on.' },
      ],
      finalCta: {
        heading: 'Ready for a Happier Grooming Day?',
        subheading: 'Book your mobile grooming appointment — we come to you.',
        ctaLabel: 'Book an Appointment',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'financing-info',
    data: {
      heading: 'Grooming Packages & Pricing',
      intro:
        'Simple, upfront pricing for mobile grooming that comes to you. Final price depends on your pet’s size, coat, and condition — you’ll always get a clear quote before we start.',
      insuranceClaimHelp: lexical([
        'Prices shown are starting points for a healthy, average-size pet. Heavy matting, larger breeds, or extra services may adjust the final quote — and we’ll always confirm it with you before we begin.',
        'Add-ons like teeth brushing, flea & tick treatment, and de-matting can be added to any package. Just let us know what you need when you book.',
      ]),
    },
  })
  await payload.updateGlobal({
    slug: 'availability-settings',
    data: {
      // Business is open Tue–Sat, 9am–6pm (closed Mon & Sun) — match the booking
      // calendar to the real hours so customers can't book a closed day.
      days: ['2', '3', '4', '5', '6'],
      startTime: '09:00',
      endTime: '18:00',
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
