'use client'

import { useState } from 'react'

export type ItemField = { name: string; label: string; type?: 'text' | 'textarea' }

const cls =
  'w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-accent'

/**
 * Friendly editor for a small list of structured objects stored as a JSON column
 * (e.g. hours [{days,time}], trust badges [{label}], why-us [{title,description}]).
 * Replaces the raw-JSON textarea a non-technical owner can't safely edit.
 *
 * Rows live in React state and are serialised to a hidden input under the field
 * name, so the existing JSON coercion in saveGlobal/saveRow persists them
 * unchanged. Fully-empty rows are dropped so blank items never reach the site.
 */
export function ListField({
  name,
  itemFields,
  initial,
}: {
  name: string
  itemFields: ItemField[]
  initial: unknown
}) {
  const seed: Record<string, string>[] = Array.isArray(initial)
    ? initial.map((o) => (o && typeof o === 'object' ? (o as Record<string, string>) : {}))
    : []
  const [rows, setRows] = useState<Record<string, string>[]>(seed)

  const update = (i: number, key: string, value: string) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)))
  const add = () =>
    setRows([...rows, Object.fromEntries(itemFields.map((f) => [f.name, '']))])
  const remove = (i: number) => setRows(rows.filter((_, idx) => idx !== i))

  // Only keep rows with at least one non-empty value.
  const clean = rows.filter((r) => itemFields.some((f) => (r[f.name] ?? '').trim() !== ''))

  return (
    <div data-testid={`list-${name}`}>
      <input type="hidden" name={name} value={JSON.stringify(clean)} readOnly />

      <div className="grid gap-2">
        {rows.map((r, i) => (
          <div key={i} className="rounded-lg border border-line bg-surface p-3">
            <div className="grid gap-2">
              {itemFields.map((f) =>
                f.type === 'textarea' ? (
                  <textarea
                    key={f.name}
                    aria-label={f.label}
                    value={r[f.name] ?? ''}
                    onChange={(e) => update(i, f.name, e.target.value)}
                    placeholder={f.label}
                    rows={2}
                    className={`${cls} resize-none`}
                  />
                ) : (
                  <input
                    key={f.name}
                    aria-label={f.label}
                    value={r[f.name] ?? ''}
                    onChange={(e) => update(i, f.name, e.target.value)}
                    placeholder={f.label}
                    className={cls}
                  />
                ),
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-2 text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="text-xs text-muted">None yet — add one below.</p>}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-2 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-accent transition hover:border-accent"
      >
        + Add
      </button>
    </div>
  )
}
