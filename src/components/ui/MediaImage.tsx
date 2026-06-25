import Image from 'next/image'
import { isMedia, type MediaLike } from '@/lib/format'

type Props = {
  media: MediaLike
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
  /** Fill the parent (which must be positioned). Use for backgrounds/cards. */
  fill?: boolean
}

/** Renders a Payload upload field as an optimized next/image, gracefully degrading when absent. */
export const MediaImage = ({ media, alt, className = '', sizes, priority, fill }: Props) => {
  if (!isMedia(media) || !media.url) {
    return <div className={`bg-brand/10 ${className}`} aria-hidden="true" />
  }
  const altText = alt ?? media.alt ?? ''

  if (fill || !media.width || !media.height) {
    return (
      <Image
        src={media.url}
        alt={altText}
        fill
        sizes={sizes ?? '100vw'}
        priority={priority}
        className={className}
      />
    )
  }

  return (
    <Image
      src={media.url}
      alt={altText}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
