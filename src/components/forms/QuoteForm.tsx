'use client'

import { useState } from 'react'
import type { Service } from '@/server/types'
import { Button } from '@/components/ui/Button'
import { submitLead } from '@/app/actions/leads'

/** Hero / contact / book quick-quote form. Submits to the submitLead server action. */
export const QuoteForm = ({
  services,
  variant = 'card',
  sourcePage = 'website',
}: {
  services: Pick<Service, 'id' | 'title'>[]
  variant?: 'card' | 'plain'
  sourcePage?: string
}) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const wrap =
    variant === 'card' ? 'rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-7' : ''

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const res = await submitLead({
      name: String(fd.get('fullName') || ''),
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || ''),
      service: String(fd.get('service') || ''),
      message: String(fd.get('message') || ''),
      sourcePage,
      website: String(fd.get('website') || ''),
    })
    if (res.ok) setStatus('done')
    else {
      setError(res.error)
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div className={wrap}>
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-ink">Request received!</h3>
          <p className="mt-1 text-sm text-muted">
            Thanks — we'll reach out shortly to confirm your grooming appointment and answer any
            questions about your pet.
          </p>
        </div>
      </div>
    )
  }

  const busy = status === 'submitting'

  return (
    <form className={wrap} onSubmit={onSubmit}>
      {variant === 'card' && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-ink">Request an Appointment</h3>
          <p className="text-sm text-muted">Tell us about your pet and we'll get you scheduled.</p>
        </div>
      )}
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
        <input
          required
          name="fullName"
          aria-label="Full name"
          placeholder="Full name"
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="tel"
            name="phone"
            aria-label="Phone number"
            placeholder="Phone"
            className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <input
            type="email"
            name="email"
            aria-label="Email"
            placeholder="Email"
            className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <select
          name="service"
          aria-label="Service you need"
          defaultValue=""
          className="w-full rounded-lg border border-line px-4 py-2.5 text-sm text-ink outline-none focus:border-accent"
        >
          <option value="" disabled>
            What do you need?
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </select>
        <textarea
          name="message"
          aria-label="About your pet"
          rows={2}
          placeholder="Tell us about your pet — breed, size, coat, anything special (optional)"
          className="w-full resize-none rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <Button type="submit" size="lg" className="w-full" >
          {busy ? 'Submitting…' : 'Request My Appointment'}
        </Button>
        <p className="text-center text-xs text-muted">
          By submitting you agree to be contacted about your project.
        </p>
      </div>
    </form>
  )
}
