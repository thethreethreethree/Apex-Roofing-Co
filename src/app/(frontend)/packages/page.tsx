import type { Metadata } from 'next'
import { getFinancingInfo, getFinancingOptions } from '@/lib/content'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { RichText } from '@/components/ui/RichText'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

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
