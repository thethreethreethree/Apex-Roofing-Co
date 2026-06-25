import React from 'react'
import { Inter } from 'next/font/google'
import './styles.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Schema } from '@/components/Schema'
import { getSiteSettings, getBranding } from '@/lib/payload'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

/** Darken a #rrggbb hex by a 0–1 factor (for derived brand-dark / accent-hover tones). */
const darken = (hex: string, factor: number): string => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return hex
  const ch = (h: string) => Math.max(0, Math.round(parseInt(h, 16) * (1 - factor)))
  return `#${[m[1], m[2], m[3]].map((h) => ch(h).toString(16).padStart(2, '0')).join('')}`
}

export const metadata = {
  title: {
    default: 'Apex Roofing Co — Roofing You Can Trust',
    template: '%s | Apex Roofing Co',
  },
  description:
    'Licensed, insured roofing contractor. Free estimates, fast repairs, and full replacements backed by a workmanship warranty. Book your free inspection online.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, branding] = await Promise.all([getSiteSettings(), getBranding()])

  const brand = branding.primaryColor || '#102a43'
  const accent = branding.accentColor || '#f97316'
  const cssVars = `:root{--brand:${brand};--brand-dark:${darken(brand, 0.25)};--accent:${accent};--accent-hover:${darken(accent, 0.1)};}`

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header settings={settings} branding={branding} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Schema />
      </body>
    </html>
  )
}
