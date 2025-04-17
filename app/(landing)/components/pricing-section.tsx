"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getPlans } from "@/lib/actions/server/pricing";
import { siteConfig } from "@/lib/site";
import { Plan, PlanFeature } from "@prisma/client";
import { Check, MessageSquare, Database } from "lucide-react";
import React, { useEffect, useState } from "react";

const extraFeatures = [
	{
		name: "free",
		messageLimit: "100",
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

export default function PricingSection() {
	const [yearlyBilling, setYearlyBilling] = useState(false);
	const [pricingPlans, setPricingPlans] = useState<(Plan & { features: PlanFeature[] })[]>([]);
	useEffect(() => {
		getPlans({ include: { features: true } }).then(({ data }) => setPricingPlans(data));
	}, []);
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
				{/*** start  */}
				{/* <div className="flex items-center justify-center space-x-4 mb-8">
					<span className={`text-lg ${!yearlyBilling ? "font-bold" : ""}`}>Monthly</span>
					<Switch checked={yearlyBilling} onCheckedChange={setYearlyBilling} />
					<span className={`text-lg ${yearlyBilling ? "font-bold" : ""}`}>Yearly</span>
				</div> */}
			
				{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"> */}
				<div
						className={`${
							pricingPlans.length === 1
								? "flex justify-center"
								: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
						} gap-8 max-w-7xl mx-auto`}
					>
					{pricingPlans.sort((a, b) => a.annuallyPrice - b.annuallyPrice).map((plan, index) => (
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
								<h3 className="text-2xl font-bold mb-4 capitalize">{plan.name}</h3>
								<div className="flex items-baseline mb-4">
									<span className="text-5xl font-bold">
										${yearlyBilling ? plan.annuallyPrice : plan.monthlyPrice}
									</span>
									<span className="text-gray-500 ml-2">
										/{yearlyBilling ? "year" : "month"}
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
										extraFeatures.find((ef) => ef.name === plan.name)
											?.recommended
											? "default"
											: "outline"
									}
								>
									<a
										href={
											siteConfig.domains.app + "/auth/sign-up?plan=" + plan.id
										}
									>
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
				</div> {/*** end  */}
			</div>
		</section>
	);
}
