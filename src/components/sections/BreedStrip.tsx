import { Container } from '@/components/ui/Container'

// Full-detail breed illustrations (the version chosen over the minis), each on a
// colored blob — the Woof-Gang "cute dog on a pastel blob" motif.
const breeds = [
  { file: 'dog-corgi', name: 'Corgi', blob: 'blob-lavender' },
  { file: 'dog-frenchie', name: 'French Bulldog', blob: 'blob-pink' },
  { file: 'dog-golden', name: 'Golden Retriever', blob: 'blob-sky' },
  { file: 'dog-poodle', name: 'Poodle', blob: 'blob-sunny' },
  { file: 'dog-terrier', name: 'Terrier', blob: 'blob-pink' },
]

export const BreedStrip = () => (
  <section className="relative overflow-hidden bg-surface">
    {/* corner doodles */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/doodle-star.webp" alt="" aria-hidden="true" className="absolute left-8 top-10 h-8 w-8 opacity-80" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/doodle-bone.webp" alt="" aria-hidden="true" className="absolute right-10 top-16 h-9 w-auto opacity-80" />
    <Container className="relative py-14 text-center sm:py-16">
      <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-accent">
        <span aria-hidden>🐶</span> All Breeds Welcome
      </p>
      <h2 className="text-3xl text-ink sm:text-4xl">Big, small, fluffy &amp; scruffy — everyone gets pampered</h2>
      <span className="squiggle mx-auto" aria-hidden />
      <div className="mt-10 flex flex-wrap items-end justify-center gap-x-4 gap-y-8 sm:gap-x-8">
        {breeds.map((b) => (
          <div key={b.file} className="group relative w-28 sm:w-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/brand/${b.blob}.webp`}
              alt=""
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 mx-auto w-full opacity-60"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/brand/${b.file}.webp`}
              alt={b.name}
              className="relative mx-auto w-24 drop-shadow-lg transition duration-200 group-hover:-translate-y-1.5 sm:w-28"
            />
            <p className="relative mt-2 text-xs font-bold text-muted">{b.name}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
)
