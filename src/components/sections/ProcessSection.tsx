import { Section } from '@/components/ui/Section'

const STEPS = [
  { t: 'Book Online', d: 'Pick an inspection time that works for you — in under a minute.' },
  { t: 'Free Inspection', d: 'A thorough 21-point assessment with honest photos and findings.' },
  { t: 'Clear Estimate', d: 'Transparent, line-item pricing with no pressure and no surprises.' },
  { t: 'Expert Installation', d: 'A clean, on-time install backed by our written workmanship warranty.' },
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
