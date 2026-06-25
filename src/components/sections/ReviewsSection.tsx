import type { Review, SiteSetting } from '@/payload-types'
import { Section } from '@/components/ui/Section'
import { Stars } from '@/components/ui/Stars'

export const ReviewsSection = ({
  reviews,
  settings,
}: {
  reviews: Review[]
  settings: SiteSetting
}) => {
  const featured = reviews.filter((r) => r.featured)
  const list = (featured.length ? featured : reviews).slice(0, 6)
  if (list.length === 0) return null

  return (
    <Section
      alt
      eyebrow="Reviews"
      title="What Our Customers Say"
      subtitle={
        settings.googleRating
          ? `${settings.googleRating}★ average across ${settings.googleReviewCount}+ verified reviews`
          : undefined
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <figure key={r.id} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
            <Stars rating={r.rating} className="mb-3" />
            <blockquote className="flex-1 text-sm leading-relaxed text-ink/90">“{r.text}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-ink">{r.author}</span>
              {r.location && <span className="text-muted"> · {r.location}</span>}
              <span className="block text-xs text-muted">via {r.source}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
