'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { db, schema } from '@/server/db'
import { hashPassword, verifyPassword } from '@/server/auth/password'
import { createSession, destroySession, requireUser } from '@/server/auth/session'
import { isRateLimited, recordFail, clientIp } from '@/lib/ratelimit'

// Brute-force throttle for the admin login. We only record a FAILED attempt, so a
// legitimate owner logging in successfully is never locked out; an attacker
// guessing passwords is capped at LOGIN_MAX_FAILS per LOGIN_WINDOW_MS per IP.
const LOGIN_MAX_FAILS = 8
const LOGIN_WINDOW_MS = 5 * 60_000

export type LoginResult = { ok: true } | { ok: false; error: string }
export type ChangePasswordResult = { ok: true } | { ok: false; error: string }

const MIN_PASSWORD_LENGTH = 10
const MAX_PASSWORD_LENGTH = 200

// Precomputed once so a login for a NON-existent user still spends the same
// scrypt time as an existing one — removes the user-enumeration timing channel.
const DUMMY_HASH = hashPassword('timing-equalizer-not-a-real-password')

export async function login(input: { username: string; password: string }): Promise<LoginResult> {
  const username = input.username?.trim()
  const password = input.password ?? ''
  if (!username || !password) return { ok: false, error: 'Enter your username and password.' }

  const ip = clientIp(await headers())
  // Check the throttle BEFORE any scrypt work, so a flood of bad-password POSTs
  // can't pin CPU/memory (verifyPassword is intentionally memory-hard).
  if (isRateLimited(`login:${ip}`, LOGIN_MAX_FAILS, LOGIN_WINDOW_MS)) {
    return { ok: false, error: 'Too many failed attempts. Please wait a few minutes and try again.' }
  }

  const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1)
  // Always spend one scrypt: a real hash for an existing user, the dummy hash
  // otherwise, so timing can't reveal which usernames exist.
  const ok = user ? verifyPassword(user.passwordHash, password) : (verifyPassword(DUMMY_HASH, password) && false)
  if (!ok || !user) {
    // Same generic message for a bad username or a bad password — leaks nothing.
    recordFail(`login:${ip}`, LOGIN_WINDOW_MS)
    return { ok: false, error: 'Invalid username or password.' }
  }
  await createSession(user.id)
  return { ok: true }
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}

/**
 * Change the signed-in user's password. Requires the current password (so a
 * hijacked open session can't silently lock out the owner), enforces a minimum
 * length, and rotates all sessions — every other device is logged out, and this
 * browser gets a fresh session so it stays signed in.
 */
export async function changePassword(input: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<ChangePasswordResult> {
  const sessionUser = await requireUser()
  const current = input.currentPassword ?? ''
  const next = input.newPassword ?? ''
  const confirm = input.confirmPassword ?? ''

  if (!current || !next || !confirm) return { ok: false, error: 'Fill in every field.' }
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` }
  }
  if (next.length > MAX_PASSWORD_LENGTH) {
    return { ok: false, error: `New password must be at most ${MAX_PASSWORD_LENGTH} characters.` }
  }
  if (next !== confirm) return { ok: false, error: 'New password and confirmation do not match.' }

  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, sessionUser.id)).limit(1)
  if (!user || !verifyPassword(user.passwordHash, current)) {
    return { ok: false, error: 'Your current password is incorrect.' }
  }
  if (verifyPassword(user.passwordHash, next)) {
    return { ok: false, error: 'New password must be different from the current one.' }
  }

  await db
    .update(schema.users)
    .set({ passwordHash: hashPassword(next), updatedAt: new Date() })
    .where(eq(schema.users.id, user.id))

  // Rotate sessions: drop every existing session for this user (logs out other
  // devices), then issue a fresh session so the current browser stays signed in.
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, user.id))
  await createSession(user.id)

  return { ok: true }
}
