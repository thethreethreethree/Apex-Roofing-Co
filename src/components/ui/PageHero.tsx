import type { ReactNode } from 'react'
import { Container } from './Container'

export const PageHero = ({
  title,
  subtitle,
  eyebrow,
  image,
  children,
}: {
  title: string
  subtitle?: string
  eyebrow?: string
  /** Optional brand mascot filename (in /public/brand, without extension) to peek in. */
  image?: string
  children?: ReactNode
}) => (
  <section className="relative isolate overflow-hidden bg-brand text-white">
    {/* paw-print texture wash */}
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-[0.13]"
      style={{ backgroundImage: "url('/brand/paw-icon.webp')", backgroundSize: '84px', backgroundRepeat: 'repeat' }}
      aria-hidden="true"
    />
    {/* soft blob accent */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/blob-pink.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 z-0 hidden h-48 w-48 opacity-20 sm:block" />
    {/* optional page mascot — anchored to the centered max-w-6xl content box
        (matching Container), NOT the full-bleed section edge (audit F5 "too far
        right"). Layering: z-[1] sits it ABOVE the paw texture/blob (z-0) so it's
        visible on top of the pattern, while the content (z-[2]) stays above it so
        the mascot never covers the heading/subtitle. */}
    {image && (
      <div
        className="pointer-events-none absolute inset-0 z-[1] mx-auto hidden max-w-6xl px-5 sm:px-8 md:block"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/brand/${image}.webp`}
          alt=""
          className="animate-float-slow absolute bottom-0 right-5 h-40 drop-shadow-2xl sm:right-8 lg:h-48"
        />
      </div>
    )}
    <Container className="relative z-[2] py-14 sm:py-16">
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white">
          <span aria-hidden>🐾</span> {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
      <span className="squiggle" aria-hidden />
      {subtitle && <p className="mt-3 max-w-2xl text-lg text-white/85">{subtitle}</p>}
      {children}
    </Container>
  </section>
)
