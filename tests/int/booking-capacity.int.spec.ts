import { describe, it, expect } from 'vitest'
import { createClient, type Client } from '@libsql/client'

// Verifies the atomic capacity guard used by createBooking(): a single
// INSERT...SELECT...WHERE count < capacity must never let more than `capacity`
// non-cancelled bookings land in a slot, even when many requests race for the
// last opening. This mirrors the exact SQL in src/app/actions/booking.ts.

async function freshDb(): Promise<Client> {
  const client = createClient({ url: ':memory:' })
  await client.execute(`
    CREATE TABLE bookings (
      id integer primary key autoincrement,
      status text, slot text, slot_label text, name text, phone text,
      email text, address text, service text, notes text,
      created_at integer, updated_at integer
    )`)
  return client
}

function guardedInsert(client: Client, slot: string, capacity: number) {
  return client.execute({
    sql: `
      INSERT INTO bookings (status, slot, slot_label, name, phone, created_at, updated_at)
      SELECT 'confirmed', ?, 'lbl', 'n', 'p', unixepoch(), unixepoch()
      WHERE (SELECT count(*) FROM bookings WHERE slot = ? AND status != 'cancelled') < ?`,
    args: [slot, slot, capacity],
  })
}

async function slotCount(client: Client, slot: string): Promise<number> {
  const r = await client.execute({ sql: `SELECT count(*) c FROM bookings WHERE slot = ?`, args: [slot] })
  return Number((r.rows[0] as { c: number }).c)
}

describe('booking capacity guard (atomic)', () => {
  it('lets exactly `capacity` bookings land when many race for one slot', async () => {
    const client = await freshDb()
    const results = await Promise.all(Array.from({ length: 12 }, () => guardedInsert(client, 'slot-A', 2)))
    const inserted = results.filter((r) => Number(r.rowsAffected) === 1).length
    expect(inserted).toBe(2) // capacity, not 12
    expect(await slotCount(client, 'slot-A')).toBe(2)
    client.close()
  })

  it('honors capacity 1 (single groomer) — one wins, the rest are refused', async () => {
    const client = await freshDb()
    const results = await Promise.all(Array.from({ length: 8 }, () => guardedInsert(client, 'slot-B', 1)))
    expect(results.filter((r) => Number(r.rowsAffected) === 1).length).toBe(1)
    expect(await slotCount(client, 'slot-B')).toBe(1)
    client.close()
  })

  it('does not count cancelled bookings against capacity', async () => {
    const client = await freshDb()
    await client.execute(`INSERT INTO bookings (status, slot, name, phone) VALUES ('cancelled', 'slot-C', 'x', 'y')`)
    // Capacity 1, one cancelled already present → a new booking should still fit.
    const r = await guardedInsert(client, 'slot-C', 1)
    expect(Number(r.rowsAffected)).toBe(1)
    // A second live booking must now be refused.
    const r2 = await guardedInsert(client, 'slot-C', 1)
    expect(Number(r2.rowsAffected)).toBe(0)
    client.close()
  })
})
