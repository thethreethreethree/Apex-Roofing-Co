export const dynamic = 'force-dynamic'

import {
  getHomePage,
  getSiteSettings,
  getServices,
  getProjects,
  getReviews,
  getCertifications,
  getFinancingOptions,
  getFinancingInfo,
} from '@/lib/payload'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { WhyUs } from '@/components/sections/WhyUs'
import { CertsStrip } from '@/components/sections/CertsStrip'
import { GalleryPreview } from '@/components/sections/GalleryPreview'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { FinancingSection } from '@/components/sections/FinancingSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { FinalCta } from '@/components/sections/FinalCta'

export default async function HomePage() {
  const [home, settings, services, projects, reviews, certs, financing, finInfo] =
    await Promise.all([
      getHomePage(),
      getSiteSettings(),
      getServices(),
      getProjects(),
      getReviews(),
      getCertifications(),
      getFinancingOptions(),
      getFinancingInfo(),
    ])

  const show = home.sections ?? {}

  return (
    <>
      <Hero home={home} settings={settings} services={services} />
      <TrustBar settings={settings} />
      <ServicesGrid services={services} />
      <WhyUs items={home.whyUs} />
      <CertsStrip certs={certs} />
      {show.showProjects !== false && <GalleryPreview projects={projects} />}
      {show.showReviews !== false && <ReviewsSection reviews={reviews} settings={settings} />}
      {show.showFinancing !== false && <FinancingSection options={financing} info={finInfo} />}
      <ProcessSection />
      <FinalCta home={home} settings={settings} />
    </>
  )
}
