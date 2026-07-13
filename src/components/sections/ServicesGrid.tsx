import Link from 'next/link'
import type { Service } from '@/server/types'
import { Section } from '@/components/ui/Section'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { Button } from '@/components/ui/Button'

// Soft rotating tile tints — the pink/plum icon art pops on a pale background.
const tileColors = ['bg-lav', 'bg-cream', 'bg-sky/15', 'bg-bubble/15', 'bg-sunny/20']

export const ServicesGrid = ({ services }: { services: Service[] }) => (
  <Section
    id="services"
    alt
    eyebrow="What We Do"
    title="Complete Mobile Grooming Services"
    subtitle="From a quick bath to a full groom — gentle, one-on-one, and right at your door."
  >
    <div className="relative mx-auto mb-10 w-fit">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/suds-cluster.webp" alt="" aria-hidden="true" className="absolute -left-20 -top-2 z-0 hidden h-20 w-auto opacity-90 sm:block" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/groomer-dog.webp" alt="" aria-hidden="true" className="relative z-10 h-44 w-auto drop-shadow-xl" />
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <Link
          key={s.id}
          href={`/services/${s.slug}`}
          className="group flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div
            className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition duration-200 group-hover:-rotate-6 group-hover:scale-105 ${tileColors[i % tileColors.length]}`}
          >
            <ServiceIcon name={s.icon} className="h-10 w-10" />
          </div>
          <h3 className="text-lg text-ink">{s.title}</h3>
          <p className="mt-2 flex-1 text-sm text-muted">{s.summary}</p>
          <div className="mt-4 flex items-center justify-between">
            {s.priceRange && <span className="text-sm font-bold text-brand">{s.priceRange}</span>}
            <span className="ml-auto text-sm font-bold text-accent transition group-hover:translate-x-0.5">
              Learn more →
            </span>
          </div>
        </Link>
      ))}
    </div>
    <div className="mt-10 text-center">
      <Button href="/packages" size="lg">
        See All Packages &amp; Pricing
      </Button>
    </div>
  </Section>
)
