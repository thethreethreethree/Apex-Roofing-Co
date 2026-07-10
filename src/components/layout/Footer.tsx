import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'
import { isMedia, telHref } from '@/lib/format'
import { getSiteSettings, getBranding, getServices, getCertifications } from '@/lib/content'

export const Footer = async () => {
  const [settings, branding, services, certs] = await Promise.all([
    getSiteSettings(),
    getBranding(),
    getServices(),
    getCertifications(),
  ])

  const company = settings.companyName ?? 'Shaggy Doggy Spa Mobile Grooming'
  const year = 2026

  return (
    <footer className="bg-brand-dark text-white/80">
      <Container className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          {isMedia(branding.logoLight) ? (
            <MediaImage media={branding.logoLight} alt={company} className="mb-4 h-10 w-auto" />
          ) : (
            <div className="mb-4 text-xl font-extrabold text-white">{company}</div>
          )}
          <p className="text-sm leading-relaxed">
            {settings.tagline ?? 'Grooming That Comes to You'}.
            {settings.insuranceStatement ? ` ${settings.insuranceStatement}.` : ''}
          </p>
          {settings.license && <p className="mt-3 text-xs opacity-70">{settings.license}</p>}
          <div className="mt-4 flex gap-3">
            {settings.social?.google && (
              <a href={settings.social.google} className="hover:text-accent" aria-label="Google">
                Google
              </a>
            )}
            {settings.social?.facebook && (
              <a href={settings.social.facebook} className="hover:text-accent" aria-label="Facebook">
                Facebook
              </a>
            )}
            {settings.social?.instagram && (
              <a href={settings.social.instagram} className="hover:text-accent" aria-label="Instagram">
                Instagram
              </a>
            )}
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Services</h3>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/services/${s.slug}`} className="hover:text-accent">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link href="/projects" className="hover:text-accent">Before & After Gallery</Link></li>
            <li><Link href="/reviews" className="hover:text-accent">Reviews</Link></li>
            <li><Link href="/packages" className="hover:text-accent">Packages & Pricing</Link></li>
            <li><Link href="/book" className="hover:text-accent">Book an Appointment</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
          <address className="space-y-2 text-sm not-italic">
            {settings.phone && (
              <p>
                <a href={telHref(settings.phone)} className="font-semibold text-white hover:text-accent">
                  {settings.phone}
                </a>
              </p>
            )}
            {settings.email && (
              <p>
                <a href={`mailto:${settings.email}`} className="hover:text-accent">
                  {settings.email}
                </a>
              </p>
            )}
          </address>
          {settings.hours && settings.hours.length > 0 && (
            <ul className="mt-4 space-y-1 text-xs opacity-80">
              {settings.hours.map((h, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-5 text-xs sm:flex-row">
          <p>
            © {year} {company}. All rights reserved.
          </p>
          {certs.length > 0 && (
            <p className="opacity-70">{certs.map((c) => c.name).join(' · ')}</p>
          )}
        </Container>
      </div>
    </footer>
  )
}
