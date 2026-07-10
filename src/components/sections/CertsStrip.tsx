import type { Certification } from '@/server/types'
import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/MediaImage'

export const CertsStrip = ({ certs }: { certs: Certification[] }) => {
  if (certs.length === 0) return null
  return (
    <div className="border-y border-line bg-surface-2">
      <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-10">
        {certs.map((c) => (
          <div key={c.id} className="flex items-center gap-3">
            <MediaImage media={c.logo} alt={c.name} className="h-12 w-12 rounded-full" />
            <div className="text-sm">
              <div className="font-bold text-ink">{c.name}</div>
              {c.description && (
                <div className="max-w-[190px] text-xs text-muted">{c.description}</div>
              )}
            </div>
          </div>
        ))}
      </Container>
    </div>
  )
}
