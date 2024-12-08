import FAQSection from "./components/faq-section";
import HeroSection from "./components/hero-section";
import SignUpSection from "./components/sign-up-section";
import PricingSection from "./components/pricing-section";
import FeaturesSection from "./components/features-section";
import StepsFlowSection from "./components/steps-flow-section";
// import TestimonialsSection from "./components/testimonials-section";

export default function LandingPage() {
	return (
		<>
			<HeroSection />
			<StepsFlowSection />
			<FeaturesSection />
			<PricingSection />
			<SignUpSection />
			<FAQSection />
			{/* <TestimonialsSection /> */}
		</>
	);
}
