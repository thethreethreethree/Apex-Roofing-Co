import type { Metadata } from 'next'
import { getReviews, getSiteSettings } from '@/lib/content'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { Stars } from '@/components/ui/Stars'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'Read reviews from local pet parents who trust us with their dogs and cats.',
}

export default async function ReviewsPage() {
  const [reviews, settings] = await Promise.all([getReviews(), getSiteSettings()])
  return (
    <>
      <PageHero
        image="reviews-dog"
        eyebrow="Reviews"
        title="What Our Customers Say"
        subtitle={
          settings.googleRating
            ? `${settings.googleRating}★ average across ${settings.googleReviewCount}+ verified reviews`
            : undefined
        }
      />
      <Section>
        <div className="flex flex-wrap justify-center gap-6">
          {reviews.map((r) => (
            <figure key={r.id} className="flex w-full flex-col rounded-2xl border border-line bg-surface p-6 sm:w-[340px]">
              <Stars rating={r.rating} className="mb-3" />
              <blockquote className="flex-1 text-sm leading-relaxed text-ink/90">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-ink">{r.author}</span>
                <span className="block text-xs text-muted">via {r.source}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <BookCtaBand />
    </>
  )
}
