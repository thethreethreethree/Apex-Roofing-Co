'use server'

import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db, schema } from '@/server/db'
import { verifyPassword } from '@/server/auth/password'
import { createSession, destroySession } from '@/server/auth/session'

export type LoginResult = { ok: true } | { ok: false; error: string }

export async function login(input: { username: string; password: string }): Promise<LoginResult> {
  const username = input.username?.trim()
  const password = input.password ?? ''
  if (!username || !password) return { ok: false, error: 'Enter your username and password.' }

  const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1)
  // Same generic error whether the user is missing or the password is wrong.
  if (!user || !verifyPassword(user.passwordHash, password)) {
    return { ok: false, error: 'Invalid username or password.' }
  }
  await createSession(user.id)
  return { ok: true }
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect('/admin/login')
}
