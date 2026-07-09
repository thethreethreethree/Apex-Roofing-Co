'use server'

import { headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
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

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  // Honeypot: real users never see the "website" field. A filled value means a
  // bot — return success so it moves on, but save nothing.
  if (input.website && input.website.trim()) return { ok: true }

  // Per-IP throttle (honeypot stops dumb bots; this slows determined floods).
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
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'leads',
      data: {
        name,
        phone,
        email: input.email?.trim() || undefined,
        service: input.service?.trim() || undefined,
        message: input.message?.trim() || undefined,
        sourcePage: input.sourcePage || undefined,
        status: 'new',
      },
    })

    // Notifications. Failure here must not fail the submission (the lead is saved).
    try {
      const settings = await payload.findGlobal({ slug: 'site-settings' })
      const owner = process.env.OWNER_NOTIFICATION_EMAIL || settings.email || undefined
      const company = settings.companyName || 'Shaggy Dog Spa Mobile Grooming'

      if (owner) {
        await payload.sendEmail({
          to: owner,
          subject: `New website lead: ${name}`,
          html: `<h2>New lead from your website</h2>
            <p><strong>Name:</strong> ${esc(name)}<br/>
            <strong>Phone:</strong> ${esc(phone)}<br/>
            ${input.email ? `<strong>Email:</strong> ${esc(input.email)}<br/>` : ''}
            ${input.service ? `<strong>Service:</strong> ${esc(input.service)}<br/>` : ''}
            ${input.sourcePage ? `<strong>Page:</strong> ${esc(input.sourcePage)}<br/>` : ''}</p>
            ${input.message ? `<p><strong>Message:</strong><br/>${esc(input.message)}</p>` : ''}`,
        })
      }

      if (input.email) {
        await payload.sendEmail({
          to: input.email,
          subject: `Thanks — we received your request | ${company}`,
          html: `<p>Hi ${esc(name)},</p>
            <p>Thanks for reaching out to ${esc(company)}. We've received your request and we'll
            contact you shortly to confirm your grooming appointment.</p>
            <p>If it's urgent, just call us at ${esc(settings.phone || '')}.</p>
            <p>— The ${esc(company)} Team</p>`,
        })
      }
    } catch (mailErr) {
      console.error('[submitLead] email send failed (lead still saved):', mailErr)
    }

    return { ok: true }
  } catch (err) {
    console.error('[submitLead] failed:', err)
    return { ok: false, error: 'Something went wrong. Please try again or call us directly.' }
  }
}
