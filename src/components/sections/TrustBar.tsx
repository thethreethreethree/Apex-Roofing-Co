import type { SiteSetting } from '@/payload-types'
import { Container } from '@/components/ui/Container'

export const TrustBar = ({ settings }: { settings: SiteSetting }) => {
  const items = [
    settings.yearsInBusiness ? { big: `${settings.yearsInBusiness}+`, label: 'Years in Business' } : null,
    settings.googleRating
      ? { big: `${settings.googleRating}★`, label: `${settings.googleReviewCount}+ 5-Star Reviews` }
      : null,
    { big: 'Licensed', label: settings.insuranceStatement ?? '& Insured' },
    { big: 'Written', label: 'Workmanship Warranty' },
  ].filter(Boolean) as { big: string; label: string }[]

  return (
    <div className="border-b border-line bg-surface">
      <Container className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl font-extrabold text-brand sm:text-3xl">{it.big}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted sm:text-sm">
              {it.label}
            </div>
          </div>
        ))}
      </Container>
    </div>
  )
}
