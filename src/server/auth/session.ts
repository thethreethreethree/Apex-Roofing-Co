import 'server-only'
import { cookies } from 'next/headers'
import { randomBytes } from 'node:crypto'
import { and, eq, gt, lt } from 'drizzle-orm'
import { db, schema } from '../db'

const COOKIE = 'sds_session'
const DURATION_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

export type SessionUser = { id: number; username: string }

/** Create a session for a user and set the httpOnly session cookie. */
export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + DURATION_MS)
  await db.insert(schema.sessions).values({ token, userId, expiresAt, createdAt: new Date() })
  // Opportunistic cleanup of expired sessions.
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()))
  const c = await cookies()
  c.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

/** Resolve the current user from the session cookie, or null. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const c = await cookies()
  const token = c.get(COOKIE)?.value
  if (!token) return null
  const rows = await db
    .select({ id: schema.users.id, username: schema.users.username })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(and(eq(schema.sessions.token, token), gt(schema.sessions.expiresAt, new Date())))
    .limit(1)
  return rows[0] ?? null
}

/** Destroy the current session (DB row + cookie). */
export async function destroySession(): Promise<void> {
  const c = await cookies()
  const token = c.get(COOKIE)?.value
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.token, token))
  c.delete(COOKIE)
}
