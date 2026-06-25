import Link from 'next/link'
import type { Metadata } from 'next'
import { getServiceAreas } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Service Areas',
  description:
    'Local, licensed roofing services across the region. Find roof replacement, repair, and storm restoration in your city.',
}

export default async function ServiceAreasPage() {
  const areas = await getServiceAreas()
  return (
    <>
      <PageHero
        eyebrow="Service Areas"
        title="Where We Work"
        subtitle="A local contractor that knows your area's weather and building codes."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <Link
              key={a.id}
              href={`/service-areas/${a.slug}`}
              className="group rounded-2xl border border-line bg-surface p-6 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
            >
              <h2 className="text-lg font-bold text-ink group-hover:text-accent">
                {a.city}, {a.state}
              </h2>
              {a.intro && <p className="mt-2 text-sm text-muted">{a.intro}</p>}
              <span className="mt-4 inline-block text-sm font-semibold text-accent">
                Roofing in {a.city} →
              </span>
            </Link>
          ))}
        </div>
      </Section>
      <BookCtaBand />
    </>
  )
}
