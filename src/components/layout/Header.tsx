'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { SiteSetting, Branding } from '@/server/types'
import { MediaImage } from '@/components/ui/MediaImage'
import { Button } from '@/components/ui/Button'
import { telHref } from '@/lib/format'
import { isMedia } from '@/lib/format'

const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/projects' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Packages', href: '/packages' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11 11 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11 11 0 0 0 .56 3.5 1 1 0 0 1-.25 1l-2.2 2.3Z" />
  </svg>
)

export const Header = ({
  settings,
  branding,
}: {
  settings: SiteSetting
  branding: Branding
}) => {
  const [open, setOpen] = useState(false)
  const phone = settings.phone ?? ''
  const company = settings.companyName ?? 'Shaggy Doggy Spa Mobile Grooming'

  return (
    <header className="sticky top-0 z-50 bg-surface/95 shadow-sm backdrop-blur">
      {/* Utility bar */}
      <div className="hidden bg-brand text-white md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-1.5 text-xs">
          <span className="opacity-90">
            {[settings.insuranceStatement, settings.license].filter(Boolean).join(' · ')}
          </span>
          <span className="flex items-center gap-4">
            {settings.emergencyPhone && (
              <span className="opacity-90">24/7 Emergency: {settings.emergencyPhone}</span>
            )}
            <a href={telHref(phone)} className="flex items-center gap-1.5 font-semibold">
              <PhoneIcon /> {phone}
            </a>
          </span>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center" aria-label={company}>
          {isMedia(branding.logo) ? (
            <MediaImage media={branding.logo} alt={company} className="h-14 w-auto sm:h-16" priority />
          ) : (
            <span className="text-xl font-extrabold tracking-tight text-brand">{company}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={telHref(phone)}
            className="hidden items-center gap-1.5 text-sm font-semibold text-brand sm:flex lg:hidden xl:flex"
          >
            <PhoneIcon /> {phone}
          </a>
          <Button href="/book" size="md" className="hidden sm:inline-flex">
            Book Now
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line py-3 text-base font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 py-4">
              <Button href="/book" size="lg">
                Book an Appointment
              </Button>
              <a
                href={telHref(phone)}
                className="flex items-center justify-center gap-2 text-base font-semibold text-brand"
              >
                <PhoneIcon /> Call {phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
