import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'

/**
 * Home gallery showcase — a masonry wall of real grooming photos (studio-quality
 * owner shots in /public/brand/showcase-*.webp). Replaced the old before/after
 * hover cards with a clean image-gallery presentation.
 */
const SHOTS = [
  { src: 'showcase-2', alt: 'A freshly groomed cream Shih Tzu with a blue bow' },
  { src: 'showcase-1', alt: 'A silver Schnauzer looking sharp with a bow tie' },
  { src: 'showcase-4', alt: 'A golden retriever in a bandana after a full groom' },
  { src: 'showcase-5', alt: 'A cream Cockapoo smiling with a red collar' },
  { src: 'showcase-3', alt: 'A black-and-tan terrier fresh from the grooming van' },
]

export const GalleryPreview = () => (
  <Section
    eyebrow="Our Gallery"
    title="Real Grooms, Happy Faces"
    subtitle="A look at some of the pampered pups fresh out of our van."
  >
    <div className="mx-auto max-w-5xl columns-2 gap-4 md:columns-3 md:gap-5 [column-fill:balance]">
      {SHOTS.map((s) => (
        <figure
          key={s.src}
          className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl shadow-soft ring-1 ring-line md:mb-5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/brand/${s.src}.webp`}
            alt={s.alt}
            loading="lazy"
            className="w-full transition duration-500 ease-out group-hover:scale-[1.04]"
          />
          {/* soft brand wash on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-brand opacity-0 shadow-sm transition-all duration-500 group-hover:opacity-100" aria-hidden>
            🐾 Shaggy Doggy Spa
          </span>
        </figure>
      ))}
    </div>
    <div className="mt-10 text-center">
      <Button href="/projects" variant="outline" size="lg">
        View Full Gallery
      </Button>
    </div>
  </Section>
)
