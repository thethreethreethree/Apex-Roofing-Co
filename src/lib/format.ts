import type { Media } from '@/server/types'

/** A Payload upload field at depth>=1 is a populated Media object; at depth 0 it's an id. */
export type MediaLike = Media | number | string | null | undefined

export const isMedia = (m: MediaLike): m is Media =>
  typeof m === 'object' && m !== null && 'url' in m

export const mediaUrl = (m: MediaLike): string | undefined =>
  isMedia(m) ? (m.url ?? undefined) : undefined

export const mediaAlt = (m: MediaLike, fallback = ''): string =>
  isMedia(m) ? (m.alt ?? fallback) : fallback

/** Strip a phone number down to a tel: href. */
export const telHref = (phone?: string | null): string =>
  phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : 'tel:'
