import type { Project } from '@/payload-types'
import { Section } from '@/components/ui/Section'
import { MediaImage } from '@/components/ui/MediaImage'
import { Button } from '@/components/ui/Button'

export const GalleryPreview = ({ projects }: { projects: Project[] }) => {
  const featured = projects.filter((p) => p.featured)
  const list = (featured.length ? featured : projects).slice(0, 3)
  if (list.length === 0) return null

  return (
    <Section
      eyebrow="Recent Work"
      title="Real Projects, Real Results"
      subtitle="Hover any project to see the before-and-after transformation."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {list.map((p) => (
          <article
            key={p.id}
            className="group overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5"
          >
            <div className="relative aspect-[4/3]">
              <MediaImage media={p.afterImage} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <MediaImage media={p.beforeImage} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                <span className="absolute left-3 top-3 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-white">
                  Before
                </span>
              </div>
              <span className="absolute right-3 top-3 rounded bg-accent px-2 py-1 text-xs font-semibold text-white transition group-hover:opacity-0">
                After
              </span>
            </div>
            <div className="bg-surface p-4">
              <h3 className="font-bold text-ink">{p.title}</h3>
              {p.city && <p className="text-sm text-muted">{p.city}</p>}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/projects" variant="outline" size="lg">
          View All Projects
        </Button>
      </div>
    </Section>
  )
}
