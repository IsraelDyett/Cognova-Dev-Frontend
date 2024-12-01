"use client";
import { useState } from "react";
import { Plan, PlanFeature } from "@prisma/client";
import { PricingToggle } from "./pricing-toggle";
import { Button } from "@/components/ui/button";
import { Check, MessageSquare, Database } from "lucide-react";
import { siteConfig } from "@/lib/site";

const extraFeatures = [
	{
		name: "free",
		messageLimit: "50",
		dataLimit: "1GB",
	},
	{
		name: "business",
		messageLimit: "1000",
		dataLimit: "10GB",
		recommended: true,
	},
	{
		name: "enterprise",
		messageLimit: "Unlimited",
		dataLimit: "100GB+",
	},
];

interface PricingDisplayProps {
	pricingPlans: (Plan & { features: PlanFeature[] })[];
}

export default function PricingDisplay({ pricingPlans }: PricingDisplayProps) {
	const [yearlyBilling, setYearlyBilling] = useState(false);

	return (
		<>
			<PricingToggle yearlyBilling={yearlyBilling} setYearlyBilling={setYearlyBilling} />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
				{pricingPlans.map((plan, index) => (
					<div
						key={index}
						className={`relative rounded-2xl border ${
							extraFeatures.find((ef) => ef.name === plan.name)?.recommended
								? "border-blue-500"
								: "border-gray-200"
						} bg-white shadow-md`}
					>
						{extraFeatures.find((ef) => ef.name === plan.name)?.recommended && (
							<div className="absolute -top-4 left-0 right-0">
								<span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
									RECOMMENDED
								</span>
							</div>
						)}

						<div className="p-8">
							<h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
							<div className="flex items-baseline mb-4">
								<span className="text-5xl font-bold">
									${false ? plan.annuallyPrice : plan.monthlyPrice}
								</span>
								<span className="text-gray-500 ml-2">
									/{false ? "year" : "month"}
								</span>
							</div>

							<div className="space-y-4 mb-8">
								<div className="flex items-center text-gray-700">
									<MessageSquare className="w-5 h-5 mr-2" />
									<span>
										{
											extraFeatures.find((ef) => ef.name === plan.name)
												?.messageLimit
										}{" "}
										messages/month
									</span>
								</div>
								<div className="flex items-center text-gray-700">
									<Database className="w-5 h-5 mr-2" />
									<span>
										{
											extraFeatures.find((ef) => ef.name === plan.name)
												?.dataLimit
										}{" "}
										storage
									</span>
								</div>
							</div>

							<Button
								className="w-full mb-8"
								variant={
									extraFeatures.find((ef) => ef.name === plan.name)?.recommended
										? "default"
										: "outline"
								}
							>
								<a href={siteConfig.domains.app + "/auth/sign-up?plan=" + plan.id}>
									Start {plan.name} Plan
								</a>
							</Button>

							<div className="space-y-4">
								<p className="font-semibold">Features included:</p>
								{plan.features.map((feature, i) => (
									<div key={i} className="flex items-start">
										<Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
										<span className="text-gray-600 text-start">
											{feature.title}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
