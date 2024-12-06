import { FileText, Bot, Share2, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function StepsFlowSection() {
	return (
		<section>
			<div className="text-center mb-16">
				<h2 className="text-base font-semibold leading-7 text-primary pb-4">
					How It Works
				</h2>
				<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Launch Your AI Sales Agent in 3 Steps
				</p>
			</div>
			<div className="grid lg:grid-cols-2 gap-12 items-center">
				<div className="space-y-16">
					<div className="flex gap-6">
						<div className="flex-shrink-0">
							<div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
								<Bot className="w-6 h-6 text-primary" />
							</div>
						</div>
						<div>
							<h4 className="text-xl font-bold mb-2">1. Create Your AI Agent</h4>
							<p className="text-gray-600 text-base">
								Set up your AI sales agent with custom personality traits and
								business knowledge. Define how it should interact with customers and
								handle different scenarios.
							</p>
						</div>
					</div>

					<div className="flex gap-6">
						<div className="flex-shrink-0">
							<div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
								<Share2 className="w-6 h-6 text-primary" />
							</div>
						</div>
						<div>
							<h4 className="text-xl font-bold mb-2">2. Share Your Agent Link</h4>
							<p className="text-gray-600 text-base">
								Get a unique chat link for your AI agent and share it with customers
								through WhatsApp, Instagram, or any other platform. Add it to your
								social media profiles for easy access.
							</p>
						</div>
					</div>

					<div className="flex gap-6">
						<div className="flex-shrink-0">
							<div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
								<MessageSquare className="w-6 h-6 text-primary" />
							</div>
						</div>
						<div>
							<h4 className="text-xl font-bold mb-2">3. Monitor & Optimize</h4>
							<p className="text-gray-600 text-base">
								Track your AI agent&apos;s performance through our dashboard.
								Monitor customer interactions, analyze conversation patterns, and
								optimize your agent&apos;s responses for better results.
							</p>
						</div>
					</div>
				</div>

				<div className="grid gap-4">
					<div className="relative overflow-hidden rounded-2xl shadow-xl bg-white p-0.5">
						<Image
							src="https://pub-a345b220415f489cb555bd6733a2e7a9.r2.dev/755shots_so.png"
							alt="AI Dashboard Analytics"
							className="h-full w-full"
							width={1910}
							height={845}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
