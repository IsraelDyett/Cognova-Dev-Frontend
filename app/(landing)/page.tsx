import HeroSection from "./_components/hero-section";
import FeaturesSection from "./_components/features-section";
import SignUpSection from "./_components/sign-up-section";
import TestimonialsSection from "./_components/testimonials-section";
import PricingSection from "./_components/pricing-section";
import StepsFlowSection from "./_components/steps-flow-section";
import FAQSection from "./_components/faq-section";
import FlowDemoSection from "./_components/flow-demo-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StepsFlowSection />
      <FlowDemoSection />
      <PricingSection />
      <FeaturesSection />
      <SignUpSection />
      <FAQSection />
      {/* <TestimonialsSection /> */}
    </>
  );
}
