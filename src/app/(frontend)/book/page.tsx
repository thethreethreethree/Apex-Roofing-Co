import type { Metadata } from 'next'
import { getServices, getSiteSettings } from '@/lib/payload'
import { getOpenSlots } from '@/app/actions/booking'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { telHref } from '@/lib/format'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book a Free Inspection',
  description: 'Schedule your free, no-obligation roof inspection online in under a minute.',
}

const STEPS = [
  'Pick a date and time that works for you',
  'Tell us where and what you need',
  'We confirm and arrive — inspection is free',
]

export default async function BookPage() {
  const [services, settings, days] = await Promise.all([
    getServices(),
    getSiteSettings(),
    getOpenSlots(),
  ])

  return (
    <>
      <PageHero
        eyebrow="Free Inspection"
        title="Book Your Free Roof Inspection"
        subtitle="No cost, no obligation. Choose a time below and we'll confirm right away."
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <ol className="space-y-5">
            {STEPS.map((s, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-1.5 font-medium text-ink">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-8 rounded-2xl border border-line bg-surface-2 p-6 text-sm text-muted">
            Prefer to talk to someone? Call{' '}
            <a href={telHref(settings.phone)} className="font-semibold text-brand hover:text-accent">
              {settings.phone}
            </a>{' '}
            and we'll get you scheduled.
          </div>
        </div>
        <div>
          <BookingCalendar initialDays={days} services={services} phone={settings.phone ?? undefined} />
        </div>
      </Container>
    </>
  )
}
