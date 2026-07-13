import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { getSiteSettings } from '@/lib/content'
import { telHref } from '@/lib/format'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default async function NotFound() {
  const settings = await getSiteSettings()
  return (
    <Container className="flex flex-col items-center gap-6 py-24 text-center sm:py-32">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/lost-pup.webp" alt="A confused puppy holding a map" className="h-56 w-auto drop-shadow-xl sm:h-64" />
      <p className="text-6xl font-extrabold text-brand sm:text-7xl">404</p>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">
        This page ran off like a dog at bath time
      </h1>
      <p className="max-w-md text-muted">
        The page you’re looking for isn’t here. Let’s get you back to a fresh, happy pet.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/" size="lg">
          Back home
        </Button>
        <Button href="/book" variant="outline" size="lg">
          Book an appointment
        </Button>
        {settings.phone && (
          <Button href={telHref(settings.phone)} variant="outline" size="lg">
            Call {settings.phone}
          </Button>
        )}
      </div>
    </Container>
  )
}
