import type { HomePage, Service, SiteSetting } from '@/payload-types'
import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'
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
    <section className="relative isolate overflow-hidden bg-brand text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <MediaImage media={hero?.backgroundImage} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-r from-brand via-brand/95 to-brand/70" />
      </div>

      <Container className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          {settings.googleRating != null && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm backdrop-blur">
              <Stars rating={settings.googleRating} />
              <span className="font-semibold">{settings.googleRating}</span>
              <span className="opacity-80">
                ({settings.googleReviewCount}+ reviews)
              </span>
            </div>
          )}

          <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl">
            {hero?.heading}
          </h1>
          {hero?.subheading && (
            <p className="mt-5 max-w-xl text-lg text-white/85">{hero.subheading}</p>
          )}

          {badges.length > 0 && (
            <ul className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-2.5">
              {badges.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-medium">
                  <Check /> {b.label}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/book" size="lg">
              {hero?.primaryCtaLabel ?? 'Book a Free Inspection'}
            </Button>
            <Button href={telHref(settings.phone)} size="lg" variant="outlineLight">
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
