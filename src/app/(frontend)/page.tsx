export const dynamic = 'force-dynamic'

import {
  getHomePage,
  getSiteSettings,
  getServices,
  getReviews,
  getCertifications,
} from '@/lib/content'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { ServicesGrid } from '@/components/sections/ServicesGrid'
import { VanBand } from '@/components/sections/VanBand'
import { WhyUs } from '@/components/sections/WhyUs'
import { BreedStrip } from '@/components/sections/BreedStrip'
import { CertsStrip } from '@/components/sections/CertsStrip'
import { GalleryPreview } from '@/components/sections/GalleryPreview'
import { ReviewsSection } from '@/components/sections/ReviewsSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { FinalCta } from '@/components/sections/FinalCta'

export default async function HomePage() {
  const [home, settings, services, reviews, certs] =
    await Promise.all([
      getHomePage(),
      getSiteSettings(),
      getServices(),
      getReviews(),
      getCertifications(),
    ])

  const show = home.sections ?? {}

  return (
    <>
      <Hero home={home} settings={settings} services={services} />
      <TrustBar settings={settings} />
      <ServicesGrid services={services} />
      <VanBand settings={settings} />
      <WhyUs items={home.whyUs} />
      <BreedStrip />
      <CertsStrip certs={certs} />
      {show.showProjects !== false && <GalleryPreview />}
      {show.showReviews !== false && <ReviewsSection reviews={reviews} settings={settings} />}
      <ProcessSection />
      <FinalCta home={home} settings={settings} />
    </>
  )
}
