import type { Metadata } from 'next'
import { getProjects, getServices } from '@/lib/content'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { ProjectsGallery } from '@/components/ProjectsGallery'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Project Gallery',
  description:
    'Browse real before-and-after grooming transformations — full grooms, deshedding, and gentle makeovers for dogs and cats across the High Desert.',
}

export default async function ProjectsPage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()])
  return (
    <>
      <PageHero
        eyebrow="Before & After"
        title="Grooming Gallery"
        subtitle="Real pets, real transformations. Hover any groom to see the before-and-after."
      />
      <Section>
        <ProjectsGallery projects={projects} services={services} />
      </Section>
      <BookCtaBand />
    </>
  )
}
