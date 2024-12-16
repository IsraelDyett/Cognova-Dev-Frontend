import React from "react";
export function ProgressSteps({ currentStep }: { currentStep: number }) {
	const steps = [
		{
			number: 1,
			title: "Create Workspace",
			subtitle: "Set up your organization's workspace",
		},
		{
			number: 2,
			title: "Business Details",
			subtitle: "Tell us about your business",
		},
		{
			number: 3,
			title: "Add Products",
			subtitle: "Add products your AI can sell",
		},
		{
			number: 4,
			title: "Configure AI Agent",
			subtitle: "Set up your AI sales assistant",
		},
		{
			number: 5,
			title: "Preview & Launch",
			subtitle: "Test your AI agent and go live",
		},
	];

	return (
		<div className="space-y-8">
			{steps.map((step, index) => (
				<div key={step.number} className="flex items-start gap-4">
					<div
						className={`rounded-full w-8 h-8 flex items-center justify-center
              ${
					index < currentStep
						? "bg-success text-success-foreground"
						: index === currentStep
							? "border-2 border-success text-success"
							: "border-2 border-gray-200 text-gray-400"
				}`}
					>
						{index < currentStep ? "✓" : step.number}
					</div>
					<div className="space-y-1">
						<h3 className="font-medium">{step.title}</h3>
						<p className="text-sm text-gray-500">{step.subtitle}</p>
					</div>
				</div>
			))}
		</div>
	);
}
