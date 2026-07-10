import Link from 'next/link'
import { notFound } from 'next/navigation'
import { globals, type GlobalSlug } from '@/server/admin/globals'
import { getGlobalRow, optionsFor, type FieldOption } from '@/server/admin/data'
import { saveGlobal } from '@/server/admin/actions'
import { AdminForm } from '@/components/admin/AdminForm'

export const dynamic = 'force-dynamic'

export default async function GlobalEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cfg = globals[slug as GlobalSlug]
  if (!cfg) notFound()

  const row = await getGlobalRow(cfg.slug)

  // Upload fields need media options (which carry url/alt for the visual control).
  const relOptions: Record<string, FieldOption[]> = {}
  for (const f of cfg.fields) {
    if (f.type === 'upload') relOptions[f.name] = await optionsFor('media')
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="border-b border-line pb-5">
        <Link href="/admin" className="text-xs font-semibold text-accent hover:underline">
          ← Manage
        </Link>
        <h1 className="text-2xl font-extrabold text-brand">{cfg.label}</h1>
      </div>

      <AdminForm
        action={saveGlobal.bind(null, cfg.slug)}
        redirectTo="/admin"
        fields={cfg.fields}
        row={row}
        relOptions={relOptions}
        titleValue={cfg.label}
      />
    </main>
  )
}
