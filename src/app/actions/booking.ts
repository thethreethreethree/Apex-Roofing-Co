'use server'

import { headers } from 'next/headers'
import { and, eq, ne } from 'drizzle-orm'
import { db, schema } from '@/server/db'
import { computeOpenDays, slotKeyToLabel, type Day, type AvailabilityConfig } from '@/lib/booking'
import { rateLimit } from '@/lib/ratelimit'

async function loadState() {
  const [settings] = await db.select().from(schema.availabilitySettings).limit(1)
  const cfg: AvailabilityConfig = {
    days: settings?.days ?? ['1', '2', '3', '4', '5'],
    startTime: settings?.startTime ?? '08:00',
    endTime: settings?.endTime ?? '16:00',
    slotMinutes: settings?.slotMinutes ?? 60,
    capacityPerSlot: settings?.capacityPerSlot ?? 2,
    weeksAhead: settings?.weeksAhead ?? 3,
    minLeadHours: settings?.minLeadHours ?? 24,
  }

  const booked = await db
    .select({ slot: schema.bookings.slot, status: schema.bookings.status })
    .from(schema.bookings)
  const taken = booked.filter((b) => b.status !== 'cancelled').map((b) => b.slot).filter(Boolean) as string[]

  const bo = await db.select({ date: schema.blackouts.date }).from(schema.blackouts)
  const blackouts = new Set(bo.map((b) => String(b.date ?? '').slice(0, 10)).filter(Boolean))

  return { cfg, taken, blackouts }
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
  if (input.website && input.website.trim()) return { ok: true, label: 'your appointment' }

  const ip = ((await headers()).get('x-forwarded-for') || '').split(',')[0].trim() || 'local'
  if (!rateLimit(`book:${ip}`, 5, 60_000)) {
    return { ok: false, error: 'Too many requests — please wait a minute and try again.' }
  }

  const name = input.name?.trim()
  const phone = input.phone?.trim()
  const slot = input.slot?.trim()
  if (!name || !phone || !slot) {
    return { ok: false, error: 'Please add your name, phone, and pick a time.' }
  }

  try {
    const { cfg, taken, blackouts } = await loadState()

    // The requested slot must still be genuinely open (weekday, lead time, blackout).
    const openDays = computeOpenDays(cfg, taken, blackouts, new Date())
    if (!openDays.some((d) => d.slots.some((s) => s.key === slot))) {
      return { ok: false, error: 'Sorry — that time is no longer available. Please pick another.' }
    }

    // Capacity guard (defense-in-depth): count non-cancelled bookings for this slot.
    const held = await db
      .select({ id: schema.bookings.id })
      .from(schema.bookings)
      .where(and(eq(schema.bookings.slot, slot), ne(schema.bookings.status, 'cancelled')))
    if (held.length >= (cfg.capacityPerSlot || 1)) {
      return { ok: false, error: 'That time slot just filled up. Please choose another time.' }
    }

    const label = slotKeyToLabel(slot)
    await db.insert(schema.bookings).values({
      slot,
      slotLabel: label,
      name,
      phone,
      email: input.email?.trim() || null,
      address: input.address?.trim() || null,
      service: input.service?.trim() || null,
      notes: input.notes?.trim() || null,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    // Notification: no email adapter yet — every booking is saved and visible in /manage.
    console.log(`[booking] ${name} · ${label}`)
    return { ok: true, label }
  } catch {
    return { ok: false, error: 'Something went wrong booking that time. Please try again or call us.' }
  }
}
