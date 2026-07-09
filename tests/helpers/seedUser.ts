import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

// Our Users collection authenticates by username (not email), so the test user
// is seeded and matched by username.
export const testUser = {
  username: 'e2e-admin',
  password: 'test1234',
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      username: {
        equals: testUser.username,
      },
    },
  })

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: testUser,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      username: {
        equals: testUser.username,
      },
    },
  })
}
