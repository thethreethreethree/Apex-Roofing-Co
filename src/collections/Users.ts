import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'email'],
    group: 'Admin',
  },
  // Login with a username (e.g. "ApexRoofing") instead of email. Email stays
  // optional so the owner can still receive system notifications if they add one.
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: false,
    },
  },
  fields: [
    // username + password added automatically by the auth config above.
  ],
}
