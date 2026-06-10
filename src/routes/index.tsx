import { createFileRoute } from '@tanstack/react-router'
import {
  Nav,
  Hero,
  OwnerSection,
  PlayerSection,
  HowItWorks,
  PricingSection,
  FinalCTA,
  Footer,
} from '~/components/landing'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="pl-root">
      <div className="pl-grain"></div>
      <Nav />
      <Hero />
      <OwnerSection />
      <PlayerSection />
      <HowItWorks />
      <PricingSection />
      <FinalCTA />
      <Footer />
    </div>
  )
}
