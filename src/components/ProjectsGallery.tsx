'use client'

import { useState } from 'react'
import type { Project, Service } from '@/server/types'
import { MediaImage } from '@/components/ui/MediaImage'

const serviceId = (p: Project): string =>
  typeof p.service === 'object' && p.service ? String(p.service.id) : String(p.service ?? '')

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''

export const ProjectsGallery = ({
  projects,
  services,
}: {
  projects: Project[]
  services: Service[]
}) => {
  const [filter, setFilter] = useState<string>('all')
  const filtered =
    filter === 'all' ? projects : projects.filter((p) => serviceId(p) === filter)

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          All Projects
        </FilterButton>
        {services
          .filter((s) => projects.some((p) => serviceId(p) === String(s.id)))
          .map((s) => (
            <FilterButton
              key={s.id}
              active={filter === String(s.id)}
              onClick={() => setFilter(String(s.id))}
            >
              {s.title}
            </FilterButton>
          ))}
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {filtered.map((p) => {
          const review =
            typeof p.linkedReview === 'object' && p.linkedReview ? p.linkedReview : null
          return (
            <article
              key={p.id}
              className="group w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-sm sm:w-[340px]"
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
              <div className="p-5">
                <div className="text-xs text-muted">{fmtDate(p.completedDate)}</div>
                <h2 className="mt-1 font-bold text-ink">{p.title}</h2>
                {p.description && <p className="mt-2 text-sm text-muted">{p.description}</p>}
                {review && (
                  <p className="mt-3 border-l-2 border-accent/40 pl-3 text-sm italic text-ink/80">
                    “{review.text?.slice(0, 110)}…” — {review.author}
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-muted">No projects in this category yet.</p>
      )}
    </div>
  )
}

const FilterButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? 'bg-brand text-white'
        : 'border border-line bg-surface text-ink hover:border-accent hover:text-accent'
    }`}
  >
    {children}
  </button>
)
