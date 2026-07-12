import type { Review, SiteSetting } from '@/server/types'
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
      title="Pawrent Approved!"
      subtitle={
        settings.googleRating
          ? `${settings.googleRating}★ average across ${settings.googleReviewCount}+ verified reviews`
          : undefined
      }
    >
      {/* Reviews mascot on a soft blob */}
      <div className="relative mx-auto mb-8 w-fit">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/blob-sky.webp" alt="" aria-hidden="true" className="absolute inset-0 m-auto h-40 w-40 opacity-50" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/reviews-dog.webp" alt="" aria-hidden="true" className="relative h-40 w-auto drop-shadow-xl" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <figure key={r.id} className="relative flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/five-star-badge.webp" alt="" aria-hidden="true" className="absolute -right-3 -top-3 h-12 w-12 drop-shadow" />
            <Stars rating={r.rating} className="mb-3" />
            <blockquote className="flex-1 text-sm leading-relaxed text-ink/90">“{r.text}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold text-ink">{r.author}</span>
              <span className="block text-xs text-muted">via {r.source}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
