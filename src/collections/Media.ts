import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Store uploads on the server's local disk in <project>/media — no external
    // object storage. Served at /api/media/file/<filename>. Back this folder up
    // (see DEPLOY.md); it holds the owner's uploaded photos.
    staticDir: path.resolve(dirname, '../../media'),
  },
}
