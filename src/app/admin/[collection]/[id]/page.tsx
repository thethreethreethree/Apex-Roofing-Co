import Link from 'next/link'
import { notFound } from 'next/navigation'
import { collections, type CollectionSlug } from '@/server/admin/config'
import { getRow, optionsFor } from '@/server/admin/data'
import { deleteRow, saveRow } from '@/server/admin/actions'
import { AdminForm } from '@/components/admin/AdminForm'

export const dynamic = 'force-dynamic'

export default async function EditPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>
}) {
  const { collection, id } = await params
  const cfg = collections[collection as CollectionSlug]
  if (!cfg) notFound()

  const isNew = id === 'new'
  if (isNew && cfg.createDisabled) notFound()
  const numId = isNew ? null : Number(id)
  const row = isNew ? null : await getRow(cfg.slug, numId as number)
  if (!isNew && !row) notFound()

  // Load dropdown options for relationship + upload fields.
  const relOptions: Record<string, { id: number; label: string }[]> = {}
  for (const f of cfg.fields) {
    if (f.type === 'relationship' && f.relTo) relOptions[f.name] = await optionsFor(f.relTo)
    else if (f.type === 'upload') relOptions[f.name] = await optionsFor('media')
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="border-b border-line pb-5">
        <Link href={`/admin/${cfg.slug}`} className="text-xs font-semibold text-accent hover:underline">
          ← {cfg.label}
        </Link>
        <h1 className="text-2xl font-extrabold text-brand">
          {isNew ? `New ${cfg.singular}` : `Edit ${cfg.singular}`}
        </h1>
      </div>

      <AdminForm
        action={saveRow.bind(null, cfg.slug, numId)}
        redirectTo={`/admin/${cfg.slug}`}
        fields={cfg.fields}
        row={row}
        relOptions={relOptions}
      />

      {!isNew && (
        <form action={deleteRow.bind(null, cfg.slug, numId as number)} className="mt-10 border-t border-line pt-6">
          <button className="text-sm font-semibold text-red-600 hover:underline">
            Delete this {cfg.singular.toLowerCase()}
          </button>
        </form>
      )}
    </main>
  )
}
