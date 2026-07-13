'use server'

import { headers } from 'next/headers'
import { db, schema } from '@/server/db'
import { rateLimit, clientIp } from '@/lib/ratelimit'

// Length caps: bound stored-data abuse (a bot past the rate limit can't write
// megabyte rows). Generous enough that no real submission is affected.
const cap = (s: string | undefined | null, n: number) => (s ? s.slice(0, n) : s)

export type LeadInput = {
  name: string
  phone: string
  email?: string
  service?: string
  message?: string
  sourcePage?: string
  /** Honeypot — hidden from humans; if a bot fills it we silently drop the submission. */
  website?: string
}

export type LeadResult = { ok: true } | { ok: false; error: string }

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  // Honeypot: real users never see the "website" field.
  if (input.website && input.website.trim()) return { ok: true }

  const ip = clientIp(await headers())
  if (!rateLimit(`lead:${ip}`, 5, 60_000)) {
    return { ok: false, error: 'Too many requests — please wait a minute and try again.' }
  }

  const name = cap(input.name?.trim(), 120)
  const phone = cap(input.phone?.trim(), 40)
  if (!name || !phone) {
    return { ok: false, error: 'Please enter your name and phone number.' }
  }

  try {
    await db.insert(schema.leads).values({
      name,
      phone,
      email: cap(input.email?.trim(), 160) || null,
      service: cap(input.service?.trim(), 80) || null,
      message: cap(input.message?.trim(), 2000) || null,
      sourcePage: cap(input.sourcePage, 120) || null,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    // Notification: no email adapter yet — every lead is saved and visible in /admin.
    console.log(`[lead] ${name} · ${phone}${input.service ? ` · ${input.service}` : ''}`)
    return { ok: true }
  } catch (err) {
    console.error('[submitLead] failed:', err)
    return { ok: false, error: 'Something went wrong. Please try again or call us directly.' }
  }
}
