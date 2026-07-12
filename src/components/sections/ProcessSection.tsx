import { Section } from '@/components/ui/Section'

// Dedicated process-step icons weren't in the asset kit, so each step reuses a
// fitting graphic the founder DID generate (phone → van → bath → happy dog).
const STEPS = [
  { t: 'Book Online', d: 'Pick an appointment time that works for you — in under a minute.', img: 'phone-pill', h: 'h-10' },
  { t: 'We Come to You', d: 'Our mobile grooming van pulls up to your driveway at the scheduled time.', img: 'grooming-van', h: 'h-16' },
  { t: 'Low-Stress Groom', d: 'One-on-one bath, haircut, and nails — calm, cage-free, and unhurried.', img: 'icon-bath', h: 'h-16' },
  { t: 'Happy, Fresh Pet', d: 'Your pet comes back clean, tidy, and smelling great — no car ride required.', img: 'hero-mascot', h: 'h-20' },
]

export const ProcessSection = () => (
  <Section eyebrow="How It Works" title="A Simple, Honest Process">
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={i} className="relative rounded-3xl bg-cream p-6 text-center shadow-soft">
          <div
            className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-extrabold text-white"
            aria-hidden="true"
          >
            {i + 1}
          </div>
          <div className="mb-3 flex h-20 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/brand/${s.img}.webp`} alt="" aria-hidden="true" className={`${s.h} w-auto object-contain`} />
          </div>
          <h3 className="font-bold text-ink">{s.t}</h3>
          <p className="mt-2 text-sm text-muted">{s.d}</p>
        </li>
      ))}
    </ol>
  </Section>
)
