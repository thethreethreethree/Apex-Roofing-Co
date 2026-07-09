import type { HomePage } from '@/payload-types'
import { Section } from '@/components/ui/Section'

export const WhyUs = ({ items }: { items: HomePage['whyUs'] }) => {
  if (!items || items.length === 0) return null
  return (
    <Section eyebrow="Why Us" title="Why Pet Parents Choose Us">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((w, i) => (
          <div key={i}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-lg font-extrabold text-accent">
              {i + 1}
            </div>
            <h3 className="font-bold text-ink">{w.title}</h3>
            {w.description && <p className="mt-2 text-sm text-muted">{w.description}</p>}
          </div>
        ))}
      </div>
    </Section>
  )
}
