"use client";
import { Switch } from "@/components/ui/switch";
import { Plan, PlanFeature } from "@prisma/client";
import React from "react";

interface PricingToggleProps {
	yearlyBilling: boolean;
	setYearlyBilling: (value: boolean) => void;
}

export function PricingToggle({ yearlyBilling, setYearlyBilling }: PricingToggleProps) {
	return (
		<div className="flex items-center justify-center space-x-4 mb-8">
			<span className={`text-lg ${!yearlyBilling ? "font-bold" : ""}`}>Monthly</span>
			<Switch checked={yearlyBilling} onCheckedChange={setYearlyBilling} />
			<span className={`text-lg ${yearlyBilling ? "font-bold" : ""}`}>Yearly</span>
		</div>
	);
}
