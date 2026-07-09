import { Section } from '@/components/ui/Section'

const STEPS = [
  { t: 'Book Online', d: 'Pick an appointment time that works for you — in under a minute.' },
  { t: 'We Come to You', d: 'Our mobile grooming van pulls up to your driveway at the scheduled time.' },
  { t: 'Low-Stress Groom', d: 'One-on-one bath, haircut, and nails — calm, cage-free, and unhurried.' },
  { t: 'Happy, Fresh Pet', d: 'Your pet comes back clean, tidy, and smelling great — no car ride required.' },
]

export const ProcessSection = () => (
  <Section eyebrow="How It Works" title="A Simple, Honest Process">
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={i}>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white">
            {i + 1}
          </div>
          <h3 className="font-bold text-ink">{s.t}</h3>
          <p className="mt-2 text-sm text-muted">{s.d}</p>
        </li>
      ))}
    </ol>
  </Section>
)
