import Link from 'next/link'
import type { Metadata } from 'next'
import { getServices } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Roofing Services',
  description:
    'Roof replacement, repair, inspections, gutters, storm restoration, and commercial roofing — backed by a written workmanship warranty.',
}

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Complete Roofing Services"
        subtitle="From a single leak to a full replacement — done right the first time, backed by a written workmanship warranty."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              href={`/services/${s.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/5 text-brand transition group-hover:bg-accent/10 group-hover:text-accent">
                <ServiceIcon name={s.icon} />
              </div>
              <h2 className="text-lg font-bold text-ink">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{s.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                {s.priceRange && (
                  <span className="text-sm font-semibold text-brand">{s.priceRange}</span>
                )}
                <span className="ml-auto text-sm font-semibold text-accent group-hover:underline">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <BookCtaBand />
    </>
  )
}
