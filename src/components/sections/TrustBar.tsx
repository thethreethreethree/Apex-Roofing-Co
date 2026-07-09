import type { SiteSetting } from '@/payload-types'
import { Container } from '@/components/ui/Container'

export const TrustBar = ({ settings }: { settings: SiteSetting }) => {
  const items = [
    settings.yearsInBusiness ? { big: `${settings.yearsInBusiness}+`, label: 'Years Grooming' } : null,
    settings.googleRating
      ? { big: `${settings.googleRating}★`, label: `${settings.googleReviewCount}+ Reviews` }
      : null,
    { big: 'Mobile', label: 'We Come to You' },
    { big: '1-on-1', label: 'One Pet at a Time' },
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
