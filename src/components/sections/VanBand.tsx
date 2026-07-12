import type { SiteSetting } from '@/server/types'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { telHref } from '@/lib/format'

/** "We come to you" band featuring the Shaggy Doggy Spa grooming van. */
export const VanBand = ({ settings }: { settings: SiteSetting }) => (
  <section className="relative overflow-hidden bg-lav">
    {/* soft polka-dot wash (real tile) */}
    <div
      className="pointer-events-none absolute inset-0 opacity-60"
      style={{ backgroundImage: "url('/brand/polka-dot-tile.webp')", backgroundSize: '360px auto' }}
      aria-hidden="true"
    />
    <Container className="relative grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-2">
      <div>
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-accent">
          <span aria-hidden>🚐</span> Mobile Grooming
        </p>
        <h2 className="text-3xl text-ink sm:text-4xl">The spa comes to your driveway</h2>
        <span className="squiggle" aria-hidden />
        <p className="mt-4 max-w-md text-lg text-muted">
          No cages, no car rides, no waiting room. Our fully-equipped pink grooming van pulls
          right up to your door for calm, one-on-one pampering across Phelan and the High Desert.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/book" size="lg">
            Book an Appointment
          </Button>
          <Button href={telHref(settings.phone)} size="lg" variant="outline">
            Call {settings.phone}
          </Button>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/grooming-van.webp"
        alt="The Shaggy Doggy Spa mobile grooming van"
        className="animate-float mx-auto h-auto w-full max-w-lg drop-shadow-2xl"
      />
    </Container>
  </section>
)
