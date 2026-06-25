import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { telHref } from '@/lib/format'
import { getSiteSettings } from '@/lib/payload'

export const BookCtaBand = async ({
  heading = 'Ready to Protect Your Home?',
  subheading = 'Book your free, no-obligation roof inspection today.',
}: {
  heading?: string
  subheading?: string
}) => {
  const settings = await getSiteSettings()
  return (
    <section className="bg-surface-2">
      <Container className="my-16 flex flex-col items-center gap-5 rounded-3xl bg-brand px-6 py-12 text-center text-white sm:my-20">
        <h2 className="max-w-2xl text-2xl font-extrabold sm:text-3xl">{heading}</h2>
        <p className="max-w-xl text-white/85">{subheading}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/book" size="lg">
            Book a Free Inspection
          </Button>
          <Button href={telHref(settings.phone)} size="lg" variant="outlineLight">
            Call {settings.phone}
          </Button>
        </div>
      </Container>
    </section>
  )
}
