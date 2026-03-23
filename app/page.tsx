import HeroPremium from './components/HeroPremium'
import ServicesSection from './components/ServicesSection'
import HowItWorksSection from './components/HowItWorksSection'
import BeforeAfterSection from './components/BeforeAfterSection'
import TestimonialsSection from './components/TestimonialsSection'
import FAQSection from './components/FAQSection'
import CTASection from './components/CTASection'
import FooterSection from './components/FooterSection'

export default function Home() {
  return (
    <main className="bg-zinc-950 overflow-x-hidden">
      <HeroPremium />
      <ServicesSection />
      <HowItWorksSection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}
