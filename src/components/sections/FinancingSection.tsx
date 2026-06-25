import type { FinancingOption, FinancingInfo } from '@/payload-types'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

export const FinancingSection = ({
  options,
  info,
}: {
  options: FinancingOption[]
  info: FinancingInfo
}) => {
  if (options.length === 0) return null
  return (
    <Section
      alt
      eyebrow="Financing & Insurance"
      title={info.heading ?? 'Flexible Financing'}
      subtitle={info.intro ?? undefined}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {options.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border-2 border-line bg-surface p-7 text-center transition hover:border-accent/50"
          >
            <h3 className="text-lg font-bold text-brand">{o.name}</h3>
            {o.terms && <p className="mt-1 text-sm font-semibold text-accent">{o.terms}</p>}
            {o.description && <p className="mt-3 text-sm text-muted">{o.description}</p>}
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/financing" variant="dark" size="lg">
          See Financing & Insurance Help
        </Button>
      </div>
    </Section>
  )
}
