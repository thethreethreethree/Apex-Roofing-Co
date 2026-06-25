import Link from 'next/link'
import type { ServiceArea } from '@/payload-types'
import { Section } from '@/components/ui/Section'

export const ServiceAreasSection = ({ areas }: { areas: ServiceArea[] }) => {
  if (areas.length === 0) return null
  return (
    <Section
      eyebrow="Service Areas"
      title="Proudly Serving Your Neighborhood"
      subtitle="Local crews, fast response, and same-week inspections across the region."
    >
      <div className="flex flex-wrap justify-center gap-3">
        {areas.map((a) => (
          <Link
            key={a.id}
            href={`/service-areas/${a.slug}`}
            className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
          >
            {a.city}, {a.state}
          </Link>
        ))}
      </div>
    </Section>
  )
}
