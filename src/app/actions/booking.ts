'use server'

import { getPayloadClient } from '@/lib/payload'
import { computeOpenDays, slotKeyToLabel, type Day, type AvailabilityConfig } from '@/lib/booking'

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const loadState = async () => {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'availability-settings' })

  const cfg: AvailabilityConfig = {
    days: (settings.days as string[] | undefined) ?? ['1', '2', '3', '4', '5'],
    startTime: settings.startTime ?? '08:00',
    endTime: settings.endTime ?? '16:00',
    slotMinutes: settings.slotMinutes ?? 60,
    capacityPerSlot: settings.capacityPerSlot ?? 2,
    weeksAhead: settings.weeksAhead ?? 3,
    minLeadHours: settings.minLeadHours ?? 24,
  }

  const booked = await payload.find({
    collection: 'bookings',
    where: { status: { not_equals: 'cancelled' } },
    limit: 5000,
    depth: 0,
  })
  const taken = booked.docs.map((b) => b.slot as string).filter(Boolean)

  const blackoutDocs = await payload.find({ collection: 'blackouts', limit: 1000, depth: 0 })
  const blackouts = new Set(
    blackoutDocs.docs.map((b) => String(b.date ?? '').slice(0, 10)).filter(Boolean),
  )

  return { payload, settings, cfg, taken, blackouts }
}

export async function getOpenSlots(): Promise<Day[]> {
  const { cfg, taken, blackouts } = await loadState()
  return computeOpenDays(cfg, taken, blackouts, new Date())
}

export type BookingInput = {
  slot: string
  name: string
  phone: string
  email?: string
  address?: string
  service?: string
  notes?: string
  /** Honeypot — hidden from humans; if a bot fills it we silently drop the booking. */
  website?: string
}

export type BookingResult = { ok: true; label: string } | { ok: false; error: string }

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  // Honeypot: a filled "website" field means a bot — accept without booking a slot.
  if (input.website && input.website.trim()) return { ok: true, label: 'your appointment' }

  const name = input.name?.trim()
  const phone = input.phone?.trim()
  const slot = input.slot?.trim()
  if (!name || !phone || !slot) {
    return { ok: false, error: 'Please add your name, phone, and pick a time.' }
  }

  try {
    const { payload, settings, cfg, taken, blackouts } = await loadState()

    // Confirm the requested slot is genuinely open right now (capacity, lead time,
    // blackout, weekday all enforced by computeOpenDays).
    const openDays = computeOpenDays(cfg, taken, blackouts, new Date())
    const stillOpen = openDays.some((d) => d.slots.some((s) => s.key === slot))
    if (!stillOpen) {
      return { ok: false, error: 'Sorry — that time is no longer available. Please pick another.' }
    }

    const label = slotKeyToLabel(slot)

    await payload.create({
      collection: 'bookings',
      data: {
        slot,
        slotLabel: label,
        name,
        phone,
        email: input.email?.trim() || undefined,
        address: input.address?.trim() || undefined,
        service: input.service?.trim() || undefined,
        notes: input.notes?.trim() || undefined,
        status: 'confirmed',
      },
    })

    // Notifications (best-effort; the booking is already saved).
    try {
      const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
      const owner = process.env.OWNER_NOTIFICATION_EMAIL || siteSettings.email || undefined
      const company = siteSettings.companyName || 'Shaggy Dog Spa Mobile Grooming'

      if (owner) {
        await payload.sendEmail({
          to: owner,
          subject: `New booking: ${name} — ${label}`,
          html: `<h2>New grooming appointment booked</h2>
            <p><strong>When:</strong> ${esc(label)}<br/>
            <strong>Name:</strong> ${esc(name)}<br/>
            <strong>Phone:</strong> ${esc(phone)}<br/>
            ${input.email ? `<strong>Email:</strong> ${esc(input.email)}<br/>` : ''}
            ${input.address ? `<strong>Address:</strong> ${esc(input.address)}<br/>` : ''}
            ${input.service ? `<strong>Service:</strong> ${esc(input.service)}<br/>` : ''}</p>
            ${input.notes ? `<p><strong>Notes:</strong><br/>${esc(input.notes)}</p>` : ''}`,
        })
      }

      if (input.email) {
        await payload.sendEmail({
          to: input.email,
          subject: `Your grooming appointment is booked — ${label}`,
          html: `<p>Hi ${esc(name)},</p>
            <p>Your mobile grooming appointment with ${esc(company)} is confirmed for <strong>${esc(label)}</strong>.</p>
            <p>We'll see you then. If anything changes, call us at ${esc(siteSettings.phone || '')}.</p>
            <p>— The ${esc(company)} Team</p>`,
        })
      }
    } catch (mailErr) {
      console.error('[createBooking] email failed (booking still saved):', mailErr)
    }

    return { ok: true, label }
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    const friendly = /filled up|no longer|available/i.test(message)
      ? message
      : 'Something went wrong booking that time. Please try again or call us.'
    return { ok: false, error: friendly }
  }
}
