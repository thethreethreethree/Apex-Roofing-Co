/**
 * Pure slot-computation for the self-scheduling calendar. Kept free of Payload
 * imports so the logic is independently testable. Times are computed in the
 * server's local timezone (fine for a single-region contractor).
 */

export type Slot = { key: string; time: string }
export type Day = { date: string; label: string; weekday: string; slots: Slot[] }

export type AvailabilityConfig = {
  days: string[] // day-of-week numbers as strings, 0=Sun..6=Sat
  startTime: string // 'HH:mm'
  endTime: string // 'HH:mm'
  slotMinutes: number
  capacityPerSlot: number
  weeksAhead: number
  minLeadHours: number
}

const pad = (n: number) => String(n).padStart(2, '0')
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const timeLabel = (hh: number, mm: number) => {
  const period = hh < 12 ? 'AM' : 'PM'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${pad(mm)} ${period}`
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/**
 * Compute the days (and open time slots within them) that a homeowner can book,
 * given the availability config, the slots already taken, and blackout dates.
 */
export const computeOpenDays = (
  cfg: AvailabilityConfig,
  takenSlots: string[],
  blackouts: Set<string>,
  now: Date,
): Day[] => {
  const counts = new Map<string, number>()
  for (const s of takenSlots) counts.set(s, (counts.get(s) ?? 0) + 1)

  const startMin = toMinutes(cfg.startTime)
  const endMin = toMinutes(cfg.endTime)
  const step = Math.max(15, cfg.slotMinutes || 60)
  const capacity = Math.max(1, cfg.capacityPerSlot || 1)
  const leadMs = (cfg.minLeadHours || 0) * 3600 * 1000
  const horizon = Math.max(1, cfg.weeksAhead || 1) * 7

  const result: Day[] = []

  for (let offset = 0; offset <= horizon; offset++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    if (!cfg.days.includes(String(day.getDay()))) continue

    const dateStr = ymd(day)
    if (blackouts.has(dateStr)) continue

    const slots: Slot[] = []
    for (let m = startMin; m < endMin; m += step) {
      const hh = Math.floor(m / 60)
      const mm = m % 60
      const slotDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hh, mm)
      if (slotDate.getTime() - now.getTime() < leadMs) continue

      const key = `${dateStr}T${pad(hh)}:${pad(mm)}`
      if ((counts.get(key) ?? 0) >= capacity) continue

      slots.push({ key, time: timeLabel(hh, mm) })
    }

    if (slots.length > 0) {
      result.push({
        date: dateStr,
        label: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekday: day.toLocaleDateString('en-US', { weekday: 'short' }),
        slots,
      })
    }
  }

  return result
}

/** Human label for a slot key, e.g. "Monday, Jun 29 at 9:00 AM". */
export const slotKeyToLabel = (key: string): string => {
  const [datePart, timePart] = key.split('T')
  const [y, mo, d] = datePart.split('-').map(Number)
  const [hh, mm] = (timePart ?? '00:00').split(':').map(Number)
  const date = new Date(y, mo - 1, d, hh, mm)
  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
  return `${dateLabel} at ${timeLabel(hh, mm)}`
}
