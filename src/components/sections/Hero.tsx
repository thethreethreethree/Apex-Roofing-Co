import type { HomePage, Service, SiteSetting } from '@/server/types'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Stars } from '@/components/ui/Stars'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { telHref } from '@/lib/format'

const Check = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={3}>
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Hero = ({
  home,
  settings,
  services,
}: {
  home: HomePage
  settings: SiteSetting
  services: Service[]
}) => {
  const hero = home.hero
  const badges = home.trustBadges ?? []

  return (
    <section className="relative isolate overflow-hidden text-ink">
      {/* Background — the provided brand background graphic */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/bg-graphic.webp" alt="" aria-hidden="true" className="h-full w-full object-cover" />
        {/* soft light scrim so the dark text stays readable over busier areas */}
        <div className="absolute inset-0 bg-white/25" />
      </div>

      {/* Hero mascot peeking up from the bottom-left (large screens) */}
      <div className="pointer-events-none absolute -left-6 bottom-0 z-0 hidden lg:block" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/hero-mascot.webp" alt="" aria-hidden="true" className="animate-float-slow h-44 drop-shadow-2xl xl:h-52" />
      </div>

      <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          {settings.googleRating != null && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm text-ink shadow-sm ring-1 ring-line">
              <Stars rating={settings.googleRating} />
              <span className="font-semibold">{settings.googleRating}</span>
              <span className="text-muted">
                ({settings.googleReviewCount}+ reviews)
              </span>
            </div>
          )}

          <h1 className="text-4xl font-extrabold leading-[1.08] text-brand sm:text-5xl">
            {hero?.heading}
          </h1>
          {hero?.subheading && (
            <p className="mt-5 max-w-xl text-lg text-ink/75">{hero.subheading}</p>
          )}

          {badges.length > 0 && (
            <ul className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5">
              {badges.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Check /> {b.label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/book" size="lg">
              {hero?.primaryCtaLabel ?? 'Book an Appointment'}
            </Button>
            <Button href={telHref(settings.phone)} size="lg" variant="outline">
              Call {settings.phone}
            </Button>
          </div>
        </div>

        <div className="lg:pl-6">
          <QuoteForm services={services} sourcePage="Home hero" />
        </div>
      </Container>
    </section>
  )
}
