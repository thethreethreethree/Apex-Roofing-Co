'use client'

import { useState } from 'react'
import type { Service } from '@/server/types'
import type { Day, Slot } from '@/lib/booking'
import { Button } from '@/components/ui/Button'
import { createBooking, getOpenSlots } from '@/app/actions/booking'
import { telHref } from '@/lib/format'

export const BookingCalendar = ({
  initialDays,
  services,
  phone,
}: {
  initialDays: Day[]
  services: Pick<Service, 'id' | 'title'>[]
  phone?: string
}) => {
  const [days, setDays] = useState<Day[]>(initialDays)
  const [activeDate, setActiveDate] = useState<string | null>(initialDays[0]?.date ?? null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [step, setStep] = useState<'pick' | 'details' | 'done'>('pick')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmedLabel, setConfirmedLabel] = useState('')

  const activeDay = days.find((d) => d.date === activeDate) ?? null

  const refresh = async () => {
    const fresh = await getOpenSlots()
    setDays(fresh)
    setActiveDate(fresh[0]?.date ?? null)
    setSlot(null)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!slot) return
    setError(null)
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const res = await createBooking({
      slot: slot.key,
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || ''),
      address: String(fd.get('address') || ''),
      service: String(fd.get('service') || ''),
      notes: String(fd.get('notes') || ''),
      website: String(fd.get('website') || ''),
    })
    setSubmitting(false)
    if (res.ok) {
      setConfirmedLabel(res.label)
      setStep('done')
    } else {
      setError(res.error)
      await refresh()
      setStep('pick')
    }
  }

  // -- Confirmed --------------------------------------------------------------
  if (step === 'done') {
    return (
      <div className="rounded-2xl bg-white p-7 shadow-xl ring-1 ring-black/5">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-ink">You're booked!</h3>
          <p className="mt-1 text-muted">
            Your grooming appointment is confirmed for
            <br />
            <strong className="text-ink">{confirmedLabel}</strong>.
          </p>
          <p className="mt-4 text-sm text-muted">
            A confirmation is on its way to your email, and we'll call to confirm details. See you
            then!
          </p>
        </div>
      </div>
    )
  }

  // -- No availability --------------------------------------------------------
  if (days.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-7 text-center shadow-xl ring-1 ring-black/5">
        <h3 className="text-lg font-bold text-ink">Let's find a time</h3>
        <p className="mt-2 text-sm text-muted">
          We don't have online slots open right now. Please give us a call and we'll get you
          scheduled right away.
        </p>
        {phone && (
          <Button href={telHref(phone)} size="lg" className="mt-4">
            Call {phone}
          </Button>
        )}
      </div>
    )
  }

  // -- Details step -----------------------------------------------------------
  if (step === 'details' && slot) {
    return (
      <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-7">
        <button
          type="button"
          onClick={() => setStep('pick')}
          className="mb-4 text-sm font-semibold text-accent hover:underline"
        >
          ← Change time
        </button>
        <div className="mb-5 rounded-lg bg-surface-2 p-3 text-sm">
          <span className="text-muted">Selected: </span>
          <strong className="text-ink">{slotKeyLabel(activeDay, slot)}</strong>
        </div>
        <div className="grid gap-3">
          {/* Honeypot: hidden from people; bots that fill it are silently dropped. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            defaultValue=""
          />
          <input required name="name" aria-label="Full name" placeholder="Full name" className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <input required name="phone" type="tel" aria-label="Phone number" placeholder="Phone" className={inputCls} />
            <input name="email" type="email" aria-label="Email" placeholder="Email" className={inputCls} />
          </div>
          <input name="address" aria-label="Address where we'll groom" placeholder="Address (where we'll come to you)" className={inputCls} />
          <select name="service" aria-label="Service" defaultValue="" className={inputCls}>
            <option value="" disabled>
              What's this about?
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
          <textarea name="notes" rows={2} aria-label="Notes" placeholder="Anything we should know? (optional)" className={`${inputCls} resize-none`} />
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Confirming…' : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    )
  }

  // -- Pick date + time -------------------------------------------------------
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-7">
      <h3 className="mb-4 text-lg font-bold text-ink">Pick a date &amp; time</h3>
      {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Date</p>
      <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const active = d.date === activeDate
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => {
                setActiveDate(d.date)
                setSlot(null)
              }}
              className={`mx-1 flex min-w-[64px] shrink-0 flex-col items-center rounded-xl border px-3 py-2 transition ${
                active ? 'border-brand bg-brand text-white' : 'border-line text-ink hover:border-accent'
              }`}
            >
              <span className="text-xs font-medium opacity-80">{d.weekday}</span>
              <span className="text-sm font-bold">{d.label}</span>
            </button>
          )
        })}
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Time</p>
      <div className="grid grid-cols-3 gap-2">
        {activeDay?.slots.map((s) => {
          const active = slot?.key === s.key
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSlot(s)}
              className={`rounded-lg border px-2 py-2.5 text-sm font-semibold transition ${
                active ? 'border-accent bg-accent text-white' : 'border-line text-ink hover:border-accent'
              }`}
            >
              {s.time}
            </button>
          )
        })}
      </div>

      <Button
        type="button"
        size="lg"
        className="mt-6 w-full"
        onClick={() => slot && setStep('details')}
      >
        {slot ? 'Continue' : 'Select a time'}
      </Button>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent'

const slotKeyLabel = (day: Day | null, slot: Slot) =>
  day ? `${day.weekday}, ${day.label} at ${slot.time}` : slot.time
