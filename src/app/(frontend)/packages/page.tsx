import type { Metadata } from 'next'
import { getFinancingInfo, getFinancingOptions } from '@/lib/content'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { RichText } from '@/components/ui/RichText'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

// Static grooming menu — illustrated tiers (asset kit round 2).
// Independent of DB financing-options; every pet gets these core services.
const TIERS = [
  { img: 'tier-full-groom', name: 'Full Groom', desc: 'Bath, haircut, nails, ears & finish — the works.' },
  { img: 'tier-bath-brush', name: 'Bath & Brush', desc: 'Deep clean, blow-dry, and a thorough brush-out.' },
  { img: 'tier-deshedding', name: 'Deshedding', desc: 'Loosen and remove the undercoat that sheds.' },
  { img: 'tier-nail-trim', name: 'Nail Trim & Grind', desc: 'Quick, calm nail care — smooth, not sharp.' },
  { img: 'tier-flea-tick', name: 'Flea & Tick Treatment', desc: 'A soothing bath that sends the pests packing.' },
  { img: 'tier-cat-grooming', name: 'Cat Grooming', desc: 'Gentle, patient grooming for feline friends too.' },
]

export const metadata: Metadata = {
  title: 'Packages & Pricing',
  description:
    'Simple, upfront pricing for mobile dog & cat grooming — full grooms, baths, deshedding, nails, and add-ons that come to your door.',
}

export default async function PackagesPage() {
  const [info, options] = await Promise.all([getFinancingInfo(), getFinancingOptions()])
  return (
    <>
      <PageHero
        image="party-dog"
        eyebrow="Packages & Pricing"
        title={info.heading ?? 'Grooming Packages & Pricing'}
        subtitle={info.intro ?? undefined}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {options.map((o) => (
            <div
              key={o.id}
              className="rounded-2xl border-2 border-line bg-surface p-7 text-center transition hover:border-accent/50"
            >
              <h2 className="text-lg font-bold text-brand">{o.name}</h2>
              {o.terms && <p className="mt-1 text-sm font-semibold text-accent">{o.terms}</p>}
              {o.description && <p className="mt-3 text-sm text-muted">{o.description}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section alt eyebrow="Our Menu" title="What We Groom">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.img}
              className="rounded-3xl bg-surface p-6 text-center shadow-soft transition hover:-translate-y-1"
            >
              <div className="mb-3 flex h-40 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/${t.img}.webp`}
                  alt={t.name}
                  className="h-40 w-auto object-contain drop-shadow"
                />
              </div>
              <h3 className="text-lg font-bold text-brand">{t.name}</h3>
              <p className="mt-2 text-sm text-muted">{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {info.insuranceClaimHelp && (
        <Section alt eyebrow="Good to Know" title="Pricing Notes">
          <div className="mx-auto max-w-3xl">
            <RichText data={info.insuranceClaimHelp} />
          </div>
        </Section>
      )}

      <BookCtaBand heading="Not sure which package fits?" subheading="Book an appointment or call us — we'll help you pick the right groom for your pet." />
    </>
  )
}
