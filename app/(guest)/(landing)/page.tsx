import HeroSection from "./components/hero-section";
import FeaturesSection from "./components/features-section";
import SignUpSection from "./components/sign-up-section";
import TestimonialsSection from "./components/testimonials-section";
import PricingSection from "./components/pricing-section";
import StepsFlowSection from "./components/steps-flow-section";
import FAQSection from "./components/faq-section";
import FlowDemoSection from "./components/flow-demo-section";

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
