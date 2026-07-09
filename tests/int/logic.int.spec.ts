import { describe, it, expect } from 'vitest'
import { computeOpenDays, type AvailabilityConfig } from '@/lib/booking'
import { rateLimit } from '@/lib/ratelimit'

// Pure-logic tests — no DB, no Payload. `computeOpenDays` takes `now` explicitly,
// so results are deterministic. Jan 5 2026 is a Monday (getDay() === 1).
const MON_JAN5_9AM = new Date(2026, 0, 5, 9, 0, 0)

const baseCfg = (over: Partial<AvailabilityConfig> = {}): AvailabilityConfig => ({
  days: ['2'], // Tuesdays only
  startTime: '08:00',
  endTime: '16:00',
  slotMinutes: 60,
  capacityPerSlot: 1,
  weeksAhead: 1,
  minLeadHours: 0,
  ...over,
})

describe('computeOpenDays', () => {
  it('only returns configured weekdays (Tuesday)', () => {
    const days = computeOpenDays(baseCfg(), [], new Set(), MON_JAN5_9AM)
    expect(days.length).toBe(1)
    expect(days[0].date).toBe('2026-01-06') // the only Tuesday within a 1-week horizon
    expect(days[0].weekday).toBe('Tue')
    expect(days[0].slots.length).toBeGreaterThan(0)
  })

  it('excludes blackout dates', () => {
    const days = computeOpenDays(baseCfg(), [], new Set(['2026-01-06']), MON_JAN5_9AM)
    expect(days.length).toBe(0)
  })

  it('drops a slot once capacity is reached', () => {
    const days = computeOpenDays(baseCfg({ capacityPerSlot: 1 }), ['2026-01-06T08:00'], new Set(), MON_JAN5_9AM)
    const tue = days.find((d) => d.date === '2026-01-06')
    expect(tue).toBeDefined()
    expect(tue!.slots.some((s) => s.key === '2026-01-06T08:00')).toBe(false) // taken
    expect(tue!.slots.some((s) => s.key === '2026-01-06T09:00')).toBe(true) // still open
  })

  it('respects minimum lead time', () => {
    // 48h lead: Tue Jan 6 (~23h out) is excluded; Tue Jan 13 (~8d out) survives.
    const days = computeOpenDays(baseCfg({ weeksAhead: 2, minLeadHours: 48 }), [], new Set(), MON_JAN5_9AM)
    expect(days.some((d) => d.date === '2026-01-06')).toBe(false)
    expect(days.some((d) => d.date === '2026-01-13')).toBe(true)
  })

  it('produces hourly slots across the configured window', () => {
    const days = computeOpenDays(baseCfg(), [], new Set(), MON_JAN5_9AM)
    // 08:00..15:00 inclusive at 60-min steps = 8 slots (endTime 16:00 is exclusive)
    expect(days[0].slots.length).toBe(8)
    expect(days[0].slots[0].time).toBe('8:00 AM')
  })
})

describe('rateLimit', () => {
  it('allows up to the limit then blocks, per key', () => {
    const results = Array.from({ length: 6 }, () => rateLimit('unit-test-key', 5, 60_000))
    expect(results.slice(0, 5).every(Boolean)).toBe(true)
    expect(results[5]).toBe(false)
    expect(rateLimit('unit-test-other-key', 5, 60_000)).toBe(true) // independent key
  })

  it('resets after the window elapses', () => {
    // 1ms window: first call consumes it, second call is a fresh window.
    expect(rateLimit('unit-test-window', 1, 1)).toBe(true)
    const later = Date.now() + 5
    while (Date.now() < later) { /* spin ~5ms so the window elapses */ }
    expect(rateLimit('unit-test-window', 1, 1)).toBe(true)
  })
})
