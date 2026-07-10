import Link from 'next/link'
import { notFound } from 'next/navigation'
import { collections, type CollectionSlug } from '@/server/admin/config'
import { listRows } from '@/server/admin/data'

export const dynamic = 'force-dynamic'

const cell = (v: unknown): string => {
  if (v == null) return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  const s = String(v)
  return s.length > 60 ? s.slice(0, 57) + '…' : s
}

export default async function ListPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params
  const cfg = collections[collection as CollectionSlug]
  if (!cfg) notFound()

  const rows = await listRows(cfg.slug)

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between border-b border-line pb-5">
        <div>
          <Link href="/manage" className="text-xs font-semibold text-accent hover:underline">
            ← Manage
          </Link>
          <h1 className="text-2xl font-extrabold text-brand">{cfg.label}</h1>
        </div>
        {!cfg.createDisabled && (
          <Link
            href={`/manage/${cfg.slug}/new`}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            + New {cfg.singular}
          </Link>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nothing here yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                {cfg.listColumns.map((c) => (
                  <th key={c} className="px-4 py-3 font-semibold">
                    {c}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={String(r.id)} className="border-t border-line hover:bg-surface-2/50">
                  {cfg.listColumns.map((c) => (
                    <td key={c} className="px-4 py-3 text-ink">
                      {cell(r[c])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/manage/${cfg.slug}/${r.id}`}
                      className="font-semibold text-accent hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
