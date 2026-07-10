import type { Metadata } from 'next'
import { getSiteSettings, getServices } from '@/lib/content'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { QuoteForm } from '@/components/forms/QuoteForm'
import { telHref } from '@/lib/format'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch to book mobile dog & cat grooming. Call, email, or request an appointment online.',
}

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()])

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk About Your Pet"
        subtitle="Quick responses and friendly scheduling. Reach us however works best for you."
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-ink">Get in touch</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="font-semibold text-muted">Phone</dt>
              <dd>
                <a href={telHref(settings.phone)} className="text-lg font-bold text-brand hover:text-accent">
                  {settings.phone}
                </a>
              </dd>
            </div>
            {settings.emergencyPhone && (
              <div>
                <dt className="font-semibold text-muted">Text / After Hours</dt>
                <dd>
                  <a href={telHref(settings.emergencyPhone)} className="font-bold text-brand hover:text-accent">
                    {settings.emergencyPhone}
                  </a>
                </dd>
              </div>
            )}
            {settings.email && (
              <div>
                <dt className="font-semibold text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${settings.email}`} className="text-ink hover:text-accent">
                    {settings.email}
                  </a>
                </dd>
              </div>
            )}
            {settings.hours && settings.hours.length > 0 && (
              <div>
                <dt className="font-semibold text-muted">Hours</dt>
                <dd>
                  <ul className="mt-1 space-y-1 text-ink">
                    {settings.hours.map((h, i) => (
                      <li key={i} className="flex justify-between gap-6">
                        <span>{h.days}</span>
                        <span className="text-muted">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div>
          <QuoteForm services={services} sourcePage="Contact page" />
        </div>
      </Container>
    </>
  )
}
