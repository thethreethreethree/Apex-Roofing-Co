import type { Metadata } from 'next'
import { getFinancingInfo, getFinancingOptions } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { RichText } from '@/components/ui/RichText'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Financing & Insurance',
  description:
    'Flexible financing plans and expert help filing storm-damage insurance claims for your new roof.',
}

export default async function FinancingPage() {
  const [info, options] = await Promise.all([getFinancingInfo(), getFinancingOptions()])
  return (
    <>
      <PageHero
        eyebrow="Financing & Insurance"
        title={info.heading ?? 'Flexible Financing & Insurance Help'}
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
        <Section alt eyebrow="Storm Damage" title="Insurance Claim Help">
          <div className="mx-auto max-w-3xl">
            <RichText data={info.insuranceClaimHelp} />
          </div>
        </Section>
      )}

      <BookCtaBand heading="Let's make your new roof affordable" subheading="Book a free inspection and we'll walk you through financing and any insurance claim." />
    </>
  )
}
