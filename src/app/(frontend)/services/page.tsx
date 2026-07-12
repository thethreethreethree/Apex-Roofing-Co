import Link from 'next/link'
import type { Metadata } from 'next'
import { getServices } from '@/lib/content'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Grooming Services',
  description:
    'Mobile dog & cat grooming: full grooms, baths & brush-outs, deshedding, nail trims, flea & tick treatment, and cat grooming — right at your door.',
}

export default async function ServicesPage() {
  const services = await getServices()
  return (
    <>
      <PageHero
        image="groomer-dog"
        eyebrow="Services"
        title="Complete Mobile Grooming Services"
        subtitle="From a quick bath to a full groom — gentle, one-on-one, and right at your door."
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
