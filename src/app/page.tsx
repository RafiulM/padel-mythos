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

export default function LandingPage() {
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
