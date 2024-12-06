import React from "react";
import {
	CloudUpload,
	Bot,
	Database,
	MessageSquare,
	LineChart,
	ShoppingCart,
	Share2,
	Instagram,
	Users,
} from "lucide-react";

const features = [
	{
		name: "AI Sales Agents",
		description:
			"Create personalized AI agents that represent your business and handle customer interactions professionally across multiple social channels.",
		href: "#",
		icon: Bot,
	},
	{
		name: "Shareable Chat Links",
		description:
			"Generate unique chat links for your AI agents that you can share with customers through any platform or add to your social media profiles.",
		href: "#",
		icon: Share2,
	},
	{
		name: "WhatsApp Integration",
		description:
			"Connect your WhatsApp Business account and let your AI agent handle customer inquiries 24/7, providing instant responses about products and services.",
		href: "#",
		icon: MessageSquare,
	},
	{
		name: "Instagram Integration",
		description:
			"Extend your AI agent's reach to Instagram DMs, providing seamless customer support and sales assistance on social media.",
		href: "#",
		icon: Instagram,
	},
	{
		name: "Advanced Analytics",
		description:
			"Track customer interactions, monitor response times, and gain insights into sales conversations to optimize your AI agent's performance.",
		href: "#",
		icon: LineChart,
	},
	{
		name: "Multi-Agent Management",
		description:
			"Create and manage multiple AI agents for different products or services, each with its own personality and expertise.",
		href: "#",
		icon: Users,
	},
];

export default function FeaturesSection() {
	return (
		<div className="py-24 sm:py-32" id="features">
			<div className="container text-center">
				<h2 className="text-base font-semibold leading-7 text-primary pb-4">
					Powerful Features
				</h2>
				<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Transform Your Customer Support with AI-Powered Intelligence
				</p>
				<p className="mt-6 text-lg leading-8 text-gray-600">
					Leverage the power of artificial intelligence to provide instant, accurate
					responses to your customers. Upload your business data, connect WhatsApp
					Business, and let our AI handle the rest.
				</p>
			</div>
			<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
				<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
					{features.map((feature) => (
						<div key={feature.name} className="flex flex-col">
							<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
								<feature.icon
									className="h-5 w-5 flex-none text-primary"
									aria-hidden="true"
								/>
								{feature.name}
							</dt>
							<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
								<p className="flex-auto">{feature.description}</p>
								<p className="mt-6">
									<a
										href={feature.href}
										className="text-sm font-semibold leading-6 text-primary"
									>
										Learn more <span aria-hidden="true">→</span>
									</a>
								</p>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
