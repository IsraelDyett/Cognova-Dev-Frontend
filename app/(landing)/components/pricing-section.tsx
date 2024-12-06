import PricingServerActions from "@/lib/actions/server/pricing";
import PricingDisplay from "./pricing-display";

export default async function PricingSection() {
	const pricingPlans = await PricingServerActions.getPlans({
		include: {
			features: true,
		},
	});
	return (
		<section id="pricing">
			<div className="text-center mb-16">
				<h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
				<h2 className="text-4xl font-bold tracking-tight mb-4">
					Choose Your AI Assistant Plan
				</h2>
				<p className="text-xl text-gray-600 mb-8">
					Scale your customer support with AI-powered WhatsApp automation
				</p>
				<PricingDisplay pricingPlans={pricingPlans.data} />
			</div>
		</section>
	);
}
