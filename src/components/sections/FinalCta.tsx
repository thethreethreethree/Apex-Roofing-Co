import type { HomePage, SiteSetting } from '@/payload-types'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { telHref } from '@/lib/format'

export const FinalCta = ({ home, settings }: { home: HomePage; settings: SiteSetting }) => (
  <section className="bg-brand">
    <Container className="flex flex-col items-center gap-6 py-16 text-center text-white sm:py-20">
      <h2 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">
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
