import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Password hashing for the custom backend. Format: `scrypt:<salt>:<hashHex>`.
 * scrypt is a memory-hard KDF; verification uses a constant-time compare.
 */
export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(pw, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

export function verifyPassword(stored: string, input: string): boolean {
  const parts = stored.split(':')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false
  const [, salt, hashHex] = parts
  const expected = Buffer.from(hashHex, 'hex')
  let actual: Buffer
  try {
    actual = scryptSync(input, salt, 64)
  } catch {
    return false
  }
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}
