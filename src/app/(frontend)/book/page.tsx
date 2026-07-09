import type { Metadata } from 'next'
import { getServices, getSiteSettings } from '@/lib/payload'
import { getOpenSlots } from '@/app/actions/booking'
import { Container } from '@/components/ui/Container'
import { PageHero } from '@/components/ui/PageHero'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import { telHref } from '@/lib/format'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Schedule mobile dog & cat grooming online in under a minute — we come to you.',
}

const STEPS = [
  'Pick a date and time that works for you',
  'Tell us where you are and what your pet needs',
  'We confirm and bring the grooming van to your door',
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
        eyebrow="Book Online"
        title="Book Your Mobile Grooming Appointment"
        subtitle="Choose a time below and we'll confirm right away — then we come to you."
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
