import type { Metadata } from 'next'
import { getSiteSettings, getCertifications, getHomePage } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { MediaImage } from '@/components/ui/MediaImage'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'A local, insured mobile dog & cat groomer serving Phelan and the High Desert — gentle, one-on-one grooming that comes to your door.',
}

export default async function AboutPage() {
  const [settings, certs, home] = await Promise.all([
    getSiteSettings(),
    getCertifications(),
    getHomePage(),
  ])
  const company = settings.companyName ?? 'Shaggy Dog Spa Mobile Grooming'

  const stats = [
    settings.yearsInBusiness ? { big: `${settings.yearsInBusiness}+`, label: 'Years Grooming' } : null,
    settings.googleReviewCount ? { big: `${settings.googleReviewCount}+`, label: 'Happy Clients' } : null,
    { big: 'Mobile', label: 'We Come to You' },
    { big: '1-on-1', label: 'One Pet at a Time' },
  ].filter(Boolean) as { big: string; label: string }[]

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Mobile Grooming, Right at Your Door"
        subtitle={`${company} was built on a simple idea: treat every pet like our own — with patience, gentleness, and care — and skip the stress of the salon.`}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-lg text-ink/90">
          <p>
            We're a local, family-run mobile grooming business serving Phelan, Piñon Hills, Oak
            Hills, Wrightwood, Hesperia, Victorville, Apple Valley, and the wider High Desert. We
            bring a fully equipped grooming van right to your driveway, so your pet never has to
            leave home.
          </p>
          <p>
            Our approach is simple: one pet at a time, no cages, no cage dryers, and no stressful
            car ride or crowded salon — just calm, patient, one-on-one grooming that's gentle enough
            for anxious pets, seniors, and puppies. {settings.insuranceStatement ?? 'Insured mobile grooming.'}
            {settings.license ? ` License ${settings.license}.` : ''}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-line bg-surface-2 p-6 text-center">
              <div className="text-2xl font-extrabold text-brand sm:text-3xl">{s.big}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {certs.length > 0 && (
        <Section alt eyebrow="Why Us" title="What Makes Us Different">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certs.map((c) => (
              <div key={c.id} className="rounded-2xl border border-line bg-surface p-6 text-center">
                <div className="mx-auto mb-4 h-16 w-16">
                  <MediaImage media={c.logo} alt={c.name} className="h-16 w-16 rounded-full" />
                </div>
                <h3 className="font-bold text-ink">{c.name}</h3>
                {c.description && <p className="mt-2 text-sm text-muted">{c.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {home.whyUs && home.whyUs.length > 0 && (
        <Section eyebrow="Our Promise" title="What You Can Count On">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {home.whyUs.map((w, i) => (
              <div key={i}>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-lg font-extrabold text-accent">
                  {i + 1}
                </div>
                <h3 className="font-bold text-ink">{w.title}</h3>
                {w.description && <p className="mt-2 text-sm text-muted">{w.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      <BookCtaBand />
    </>
  )
}
