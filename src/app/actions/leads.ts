'use server'

import { headers } from 'next/headers'
import { db, schema } from '@/server/db'
import { rateLimit } from '@/lib/ratelimit'

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

  const ip = ((await headers()).get('x-forwarded-for') || '').split(',')[0].trim() || 'local'
  if (!rateLimit(`lead:${ip}`, 5, 60_000)) {
    return { ok: false, error: 'Too many requests — please wait a minute and try again.' }
  }

  const name = input.name?.trim()
  const phone = input.phone?.trim()
  if (!name || !phone) {
    return { ok: false, error: 'Please enter your name and phone number.' }
  }

  try {
    await db.insert(schema.leads).values({
      name,
      phone,
      email: input.email?.trim() || null,
      service: input.service?.trim() || null,
      message: input.message?.trim() || null,
      sourcePage: input.sourcePage || null,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    // Notification: no email adapter yet — every lead is saved and visible in /manage.
    console.log(`[lead] ${name} · ${phone}${input.service ? ` · ${input.service}` : ''}`)
    return { ok: true }
  } catch (err) {
    console.error('[submitLead] failed:', err)
    return { ok: false, error: 'Something went wrong. Please try again or call us directly.' }
  }
}
