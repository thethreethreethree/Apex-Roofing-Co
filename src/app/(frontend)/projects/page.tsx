import type { Metadata } from 'next'
import { getProjects, getServices } from '@/lib/payload'
import { Section } from '@/components/ui/Section'
import { PageHero } from '@/components/ui/PageHero'
import { ProjectsGallery } from '@/components/ProjectsGallery'
import { BookCtaBand } from '@/components/sections/BookCtaBand'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Project Gallery',
  description:
    'Browse real before-and-after roofing projects — replacements, repairs, storm restorations, and more, completed across the region.',
}

export default async function ProjectsPage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()])
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Project Gallery"
        subtitle="Real homes, real results. Hover any project to see the before-and-after."
      />
      <Section>
        <ProjectsGallery projects={projects} services={services} />
      </Section>
      <BookCtaBand />
    </>
  )
}
