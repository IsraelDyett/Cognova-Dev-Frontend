"use client";
import { useState, useEffect } from "react";
import { ProgressSteps } from "./components/progress-steps";
import CreateWorkspaceDialog from "./components/create-workspace-form";
import dynamic from "next/dynamic";
import { WorkspaceProvider } from "../contexts/workspace-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function OnBoardingPage() {
	const [onboardingData, setOnboardingData] = useState<{
		workspaceId?: string;
		businessId?: string;
		botId?: string;
	}>({});
	const [currentStep, setCurrentStep] = useState(1);

	const CreateBusinessModal = dynamic(() =>
		import("../(workspace)/[workspaceId]/businesses/components/form").then(
			(mod) => mod.BusinessForm,
		),
	);

	const CreateProductsModal = dynamic(() =>
		import(
			"../(workspace)/[workspaceId]/businesses/[businessId]/products/components/form"
		).then((mod) => mod.ProductForm),
	);

	const CreateBotModal = dynamic(() =>
		import("../(workspace)/[workspaceId]/businesses/[businessId]/bots/components/form").then(
			(mod) => mod.BotForm,
		),
	);
	const router = useRouter();

	useEffect(() => {
		const savedData = localStorage.getItem("onboardingData");
		const savedStep = localStorage.getItem("currentStep");

		if (savedData) {
			setOnboardingData(JSON.parse(savedData));
		}
		if (savedStep) {
			setCurrentStep(parseInt(savedStep));
		}
	}, []);

	useEffect(() => {
		if (Object.keys(onboardingData).length > 0 || currentStep > 1) {
			localStorage.setItem("onboardingData", JSON.stringify(onboardingData));
			localStorage.setItem("currentStep", currentStep.toString());
		}
	}, [onboardingData, currentStep]);

	const triggerFireworks = () => {
		const duration = 5 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

		const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

		const interval = window.setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);
	};

	return (
		<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
			<div className={currentStep == 1 ? "block" : "hidden lg:block"}>
				<h1 className="text-2xl font-bold mb-2">Set up your AI Sales Agent</h1>
				<p
					className={
						currentStep == 1
							? "hidden lg:block text-gray-500 mb-8"
							: "text-gray-500 mb-8"
					}
				>
					Complete these steps to create your AI-powered sales assistant
				</p>
				<ProgressSteps currentStep={currentStep} />
			</div>

			<div className="space-y-6">
				{currentStep === 1 && (
					<CreateWorkspaceDialog
						onComplete={(workspace) => {
							setCurrentStep(2);
							setOnboardingData({ ...onboardingData, workspaceId: workspace?.id });
						}}
					/>
				)}

				{currentStep > 1 && onboardingData.workspaceId && (
					<WorkspaceProvider overrideWorkspaceId={onboardingData.workspaceId}>
						{currentStep === 2 && (
							<>
								<div className="space-y-2">
									<h2 className="text-xl font-semibold">Create your business</h2>
									<p className="text-gray-500">
										Add your business details to get started
									</p>
								</div>
								<div className="[&_button[type='submit']]:!w-full">
									<CreateBusinessModal
										wrapInDialog={false}
										onComplete={(business) => {
											setCurrentStep(3);
											setOnboardingData({
												...onboardingData,
												businessId: business?.id,
											});
										}}
									/>
								</div>
							</>
						)}
						{currentStep === 3 && (
							<>
								<div className="space-y-2">
									<h2 className="text-xl font-semibold">Add your products</h2>
									<p className="text-gray-500">
										Add products for your AI to showcase and discuss with
										customers
									</p>
								</div>
								<div className="[&_button[type='submit']]:!w-full [&_div[id='description']]:!w-full [&_div[id='stock']]:!hidden [&_div[id='isActive']]:!hidden">
									<CreateProductsModal
										wrapInDialog={false}
										onComplete={() => setCurrentStep(4)}
									/>
								</div>
							</>
						)}
						{currentStep === 4 && (
							<>
								<div className="space-y-2">
									<h2 className="text-xl font-semibold">Configure your AI</h2>
									<p className="text-gray-500">
										Set up how your AI assistant will interact
									</p>
								</div>
								<div className="[&_div[id='modelId']>div]:!col-span-2 [&_button[type='submit']]:!w-full">
									<CreateBotModal
										wrapInDialog={false}
										onComplete={(bot) => {
											setCurrentStep(5);
											setOnboardingData({
												...onboardingData,
												botId: bot?.id,
											});
											triggerFireworks();
										}}
									/>
								</div>
							</>
						)}
					</WorkspaceProvider>
				)}
				{currentStep === 5 && (
					<div className="fixed z-20 p-2 inset-0 backdrop-blur-md flex items-center justify-center">
						<Card className="p-6 max-w-xl">
							<div className="space-y-4">
								<div>
									<h3 className="text-lg font-semibold">
										Your AI Sales Agent is ready!
									</h3>
									<p className="text-gray-500">
										You can now preview your AI agent and share it with your
										customers. They&apos;ll be able to ask questions about your
										products and get instant responses.
									</p>
								</div>
								<div className="flex flex-col sm:flex-row gap-3">
									<Button
										onClick={() => {
											// Clear localStorage on completion
											localStorage.removeItem("onboardingData");
											localStorage.removeItem("currentStep");
											router.push(
												`${siteConfig.domains.root}/chats/${onboardingData.botId}`,
											);
										}}
										className="flex-1"
									>
										Preview Bot
									</Button>
									<Button
										onClick={() => {
											router.push(siteConfig.domains.app);
										}}
										variant="outline"
										className="flex-1"
									>
										Dashboard
									</Button>
								</div>
							</div>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}
