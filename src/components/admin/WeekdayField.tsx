'use client'

import { useState } from 'react'

// Day-of-week numbers as the booking logic expects them: 0 = Sunday … 6 = Saturday.
const DAYS = [
  { num: '0', label: 'Sun' },
  { num: '1', label: 'Mon' },
  { num: '2', label: 'Tue' },
  { num: '3', label: 'Wed' },
  { num: '4', label: 'Thu' },
  { num: '5', label: 'Fri' },
  { num: '6', label: 'Sat' },
]

/**
 * Friendly weekday picker for a `json` field that stores day-of-week numbers
 * (e.g. ["2","3","4","5","6"]). Shows Sun–Sat buttons you click on/off — no JSON.
 * The selection serialises to a hidden input (day order), so the existing JSON
 * coercion in saveGlobal persists it unchanged.
 */
export function WeekdayField({ name, initial }: { name: string; initial: unknown }) {
  const seed = new Set(Array.isArray(initial) ? initial.map((d) => String(d)) : [])
  const [selected, setSelected] = useState<Set<string>>(seed)

  const toggle = (num: string) => {
    const next = new Set(selected)
    if (next.has(num)) next.delete(num)
    else next.add(num)
    setSelected(next)
  }

  // Always serialise in Sun→Sat order for a stable, predictable value.
  const value = JSON.stringify(DAYS.filter((d) => selected.has(d.num)).map((d) => d.num))

  return (
    <div>
      <input type="hidden" name={name} value={value} readOnly />
      <div className="flex flex-wrap gap-2">
        {DAYS.map((d) => {
          const on = selected.has(d.num)
          return (
            <button
              key={d.num}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(d.num)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                on
                  ? 'border-accent bg-accent text-white'
                  : 'border-line text-ink hover:border-accent'
              }`}
            >
              {d.label}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-muted">Click the days you take bookings.</p>
    </div>
  )
}
