import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceAreaBySlug, getServices } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { RichText } from '@/components/ui/RichText'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { BookCtaBand } from '@/components/sections/BookCtaBand'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const area = await getServiceAreaBySlug(slug)
  if (!area) return {}
  return {
    title: `Roofing in ${area.city}, ${area.state}`,
    description: area.intro ?? `Licensed roofing services in ${area.city}, ${area.state}.`,
  }
}

export default async function ServiceAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [area, services] = await Promise.all([getServiceAreaBySlug(slug), getServices()])
  if (!area) notFound()

  return (
    <>
      <PageHero
        eyebrow="Service Area"
        title={`Roofing in ${area.city}, ${area.state}`}
        subtitle={area.intro ?? undefined}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RichText data={area.content} />
            {area.mapEmbedUrl && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-line">
                <iframe
                  src={area.mapEmbedUrl}
                  title={`Map of ${area.city}`}
                  className="h-72 w-full"
                  loading="lazy"
                />
              </div>
            )}
          </div>
          <aside>
            <h2 className="mb-4 font-bold text-ink">Services in {area.city}</h2>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex items-center gap-2 text-sm text-ink/80 hover:text-accent"
                  >
                    <ServiceIcon name={s.icon} className="h-5 w-5 text-accent" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
      <BookCtaBand heading={`Need a roofer in ${area.city}?`} />
    </>
  )
}
