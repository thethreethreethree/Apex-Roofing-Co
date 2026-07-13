import type { HomePage, SiteSetting } from '@/server/types'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { telHref } from '@/lib/format'

export const FinalCta = ({ home, settings }: { home: HomePage; settings: SiteSetting }) => (
  <section className="relative overflow-hidden bg-brand">
    {/* Leopard-print accent strip — a nod to the van's windows */}
    <div
      className="h-5 w-full bg-repeat opacity-90"
      style={{ backgroundImage: "url('/brand/leopard-pattern-pink.webp')", backgroundSize: 'auto 100%' }}
      aria-hidden="true"
    />
    {/* Confetti sheet across the band */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/brand/confetti-doodle-pack-2.webp"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
    />
    {/* Party dog peeking in from the right (large screens) */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/brand/party-dog.webp"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute -right-2 bottom-0 hidden h-56 drop-shadow-2xl md:block lg:h-64"
    />
    {/* Party hat flourish (left, large screens) */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/brand/party-hat-striped.webp"
      alt=""
      aria-hidden="true"
      className="animate-float pointer-events-none absolute bottom-8 left-6 hidden h-20 w-auto -rotate-12 drop-shadow-lg lg:block"
    />
    <Container className="relative z-10 flex flex-col items-center gap-6 py-16 text-center text-white sm:py-20">
      <h2 className="max-w-2xl text-3xl sm:text-4xl">
        {home.finalCta?.heading ?? 'Ready for a Happier Grooming Day?'}
      </h2>
      {home.finalCta?.subheading && (
        <p className="max-w-xl text-lg text-white/85">{home.finalCta.subheading}</p>
      )}
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/book" size="lg">
          {home.finalCta?.ctaLabel ?? 'Book an Appointment'}
        </Button>
        <Button href={telHref(settings.phone)} size="lg" variant="outlineLight">
          Call {settings.phone}
        </Button>
      </div>
    </Container>
  </section>
)
