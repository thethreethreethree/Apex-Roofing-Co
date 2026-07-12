import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceBySlug, getSiteSettings } from '@/lib/content'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { Button } from '@/components/ui/Button'
import { BookCtaBand } from '@/components/sections/BookCtaBand'
import { isMedia, telHref } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return { title: service.title, description: service.summary }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()])
  if (!service) notFound()

  return (
    <>
      <PageHero image="groomer-dog" eyebrow="Grooming Service" title={service.title} subtitle={service.summary ?? undefined} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isMedia(service.image) && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl">
                <MediaImage media={service.image} fill className="object-cover" sizes="66vw" />
              </div>
            )}
            <RichText data={service.description} />
          </div>

          <aside className="lg:pl-2">
            <div className="sticky top-28 rounded-2xl border border-line bg-surface-2 p-6">
              {service.priceRange && (
                <>
                  <p className="text-sm font-medium text-muted">Starting price</p>
                  <p className="mb-4 text-2xl font-extrabold text-brand">{service.priceRange}</p>
                </>
              )}
              <p className="mb-4 text-sm text-muted">
                Book {service.title.toLowerCase()} and we'll come to you — final quote confirmed before we start.
              </p>
              <div className="flex flex-col gap-3">
                <Button href="/book" size="lg" className="w-full">
                  Book an Appointment
                </Button>
                <Button href={telHref(settings.phone)} variant="outline" className="w-full">
                  Call {settings.phone}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>
      <BookCtaBand />
    </>
  )
}
