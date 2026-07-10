import Link from 'next/link'
import { listRows } from '@/server/admin/data'
import { MediaUpload } from '@/components/manage/MediaUpload'

export const dynamic = 'force-dynamic'

export default async function MediaLibrary() {
  const rows = await listRows('media')

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="border-b border-line pb-5">
        <Link href="/manage" className="text-xs font-semibold text-accent hover:underline">
          ← Manage
        </Link>
        <h1 className="text-2xl font-extrabold text-brand">Media</h1>
      </div>

      <div className="mt-6">
        <MediaUpload />
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No media yet — upload a photo above.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((r) => (
            <Link
              key={String(r.id)}
              href={`/manage/media/${r.id}`}
              className="group overflow-hidden rounded-xl border border-line bg-surface transition hover:border-accent/50"
            >
              <div className="aspect-square bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/media-file/${String(r.filename)}`}
                  alt={String(r.alt ?? '')}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-2">
                <div className="truncate text-xs font-semibold text-ink">{String(r.filename)}</div>
                <div className="truncate text-[11px] text-muted">{String(r.alt ?? '—')}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
