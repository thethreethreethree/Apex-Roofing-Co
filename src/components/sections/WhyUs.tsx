import type { HomePage } from '@/server/types'
import { Section } from '@/components/ui/Section'

export const WhyUs = ({ items }: { items: HomePage['whyUs'] }) => {
  if (!items || items.length === 0) return null
  return (
    <Section eyebrow="Why Us" title="Why Pet Parents Choose Us">
      <div className="grid items-start gap-8 lg:grid-cols-[auto_1fr]">
        <div className="relative mx-auto hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/blob-lavender.webp" alt="" aria-hidden="true" className="absolute inset-0 m-auto h-56 w-56 opacity-50" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/spa-dog.webp" alt="" aria-hidden="true" className="relative h-56 w-auto drop-shadow-xl" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
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
      </div>
    </Section>
  )
}
