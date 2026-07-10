'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveRow } from '@/server/admin/actions'
import type { CollectionSlug, FieldDef } from '@/server/admin/config'

type RelOptions = Record<string, { id: number; label: string }[]>

const inputCls =
  'w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent'

const asDateInput = (v: unknown): string => (typeof v === 'string' ? v.slice(0, 10) : '')

export function AdminForm({
  slug,
  id,
  fields,
  row,
  relOptions,
}: {
  slug: CollectionSlug
  id: number | null
  fields: FieldDef[]
  row: Record<string, unknown> | null
  relOptions: RelOptions
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const res = await saveRow(slug, id, fd)
    setBusy(false)
    if (res.ok) router.push(`/manage/${slug}`)
    else setError(res.error)
  }

  const val = (name: string) => {
    const v = row?.[name]
    return v == null ? '' : String(v)
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-5">
      {fields.map((f) => {
        const label = (
          <label htmlFor={`f-${f.name}`} className="mb-1 block text-sm font-semibold text-ink">
            {f.label}
            {f.required && <span className="text-red-500"> *</span>}
          </label>
        )
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                name={f.name}
                defaultChecked={Boolean(row?.[f.name])}
                className="h-4 w-4"
              />
              {f.label}
            </label>
          )
        }
        return (
          <div key={f.name}>
            {label}
            {f.type === 'textarea' && (
              <textarea id={`f-${f.name}`} name={f.name} rows={3} defaultValue={val(f.name)} className={inputCls} />
            )}
            {(f.type === 'richText' || f.type === 'json') && (
              <textarea
                id={`f-${f.name}`}
                name={f.name}
                rows={6}
                defaultValue={row?.[f.name] != null ? JSON.stringify(row[f.name], null, 2) : ''}
                className={`${inputCls} font-mono text-xs`}
                spellCheck={false}
              />
            )}
            {f.type === 'select' && (
              <select id={`f-${f.name}`} name={f.name} defaultValue={val(f.name)} className={inputCls}>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}
            {(f.type === 'relationship' || f.type === 'upload') && (
              <select id={`f-${f.name}`} name={f.name} defaultValue={val(f.name)} className={inputCls}>
                <option value="">— none —</option>
                {(relOptions[f.name] ?? []).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} (#{o.id})
                  </option>
                ))}
              </select>
            )}
            {f.type === 'date' && (
              <input id={`f-${f.name}`} type="date" name={f.name} defaultValue={asDateInput(row?.[f.name])} className={inputCls} />
            )}
            {(f.type === 'text' || f.type === 'email' || f.type === 'number') && (
              <input
                id={`f-${f.name}`}
                type={f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text'}
                name={f.name}
                defaultValue={val(f.name)}
                className={inputCls}
              />
            )}
            {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
          </div>
        )
      })}

      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/manage/${slug}`)}
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
