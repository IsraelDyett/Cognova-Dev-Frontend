import React from "react";
import { siteConfig } from "@/lib/site";
import StatsSection from "./stats-section";
import { Button } from "@/components/ui/button";
import Iphone15Pro from "@/components/ui/iphone-15-pro";
import { Bot, MessageSquare, Sparkles } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
	return (
		<div className="relative isolate pt-16">
			<svg
				className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
				aria-hidden="true"
			>
				<defs>
					<pattern
						id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
						width={200}
						height={200}
						x="50%"
						y={-1}
						patternUnits="userSpaceOnUse"
					>
						<path d="M100 200V.5M.5 .5H200" fill="none" />
					</pattern>
				</defs>
				<svg x="50%" y={-1} className="overflow-visible fill-gray-50">
					<path
						d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
						strokeWidth={0}
					/>
				</svg>
				<rect
					width="100%"
					height="100%"
					strokeWidth={0}
					fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
				/>
			</svg>
			<div className="lg:flex lg:items-center lg:gap-x-10">
				<div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
					<h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-black/80 to-black/20 sm:text-6xl">
						<a
							href="https://www.producthunt.com/posts/cognova"
							target="_blank"
							className="relative top-0 left-0 inline-block transform -translate-y-6 sm:-ml-2 -rotate-2 group"
						>
							<span className="relative z-20 w-full h-full pr-3 pl-6 py-1.5 text-[0.6rem] sm:text-xs font-bold leading-tight tracking-wide text-center uppercase bg-white border-2 rounded text-[#ff6154] border-[#ff6154] group-hover:bg-[#ff6154] group-hover:text-white flex items-center">
								<Image
									alt="Product hunt"
									width={36}
									height={36}
									src="https://cdn.devdojo.com/images/june2023/product-hunt-logo-orange-240.png"
									className="absolute left-0 mr-3 -translate-x-3 -translate-y-3 border-4 border-white rounded-full w-9 h-9"
								/>
								<span>Give us a vote on ProductHunt</span>
								<svg
									className="w-4 h-4 ml-1.5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
								>
									<g fill="none" stroke="none">
										<path
											d="M19 13.013v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h4m8 0v4m0-4h-4m4 0l-7 7"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										></path>
									</g>
								</svg>
							</span>
							<span className="absolute inset-0 z-10 group-hover:ml-0 group-hover:mt-0 ease-out duration-300 w-full h-full block mt-0.5 ml-0.5 bg-[#ff6154] rounded"></span>
						</a>
						Transform Your Customer Support with AI Chat
					</h1>
					<p className="mt-6 text-lg leading-8 text-gray-600">
						Create your AI sales agent in minutes. Let it handle customer conversations
						on Instagram and your website while you focus on growing your business.
					</p>
					<div className="flex mt-10 flex-col sm:flex-row gap-4 justify-center lg:justify-start">
						<Button size="lg" className="group" asChild>
							<a
								href={
									siteConfig.domains.app +
									"/auth/sign-up?utm_source=landing&utm_medium=hero-section&utm_campaign=get-started"
								}
							>
								<span>Get Started Now</span>
								<Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
							</a>
						</Button>
						{/* <Button size="lg" variant="outline">
								Watch Demo
								<Bot className="ml-2 h-4 w-4" />
							</Button> */}
					</div>
					<div className="mt-8 flex items-center justify-center lg:justify-start gap-8">
						<div className="flex items-center">
							<MessageSquare className="h-5 w-5 text-primary mr-2" />
							<span className="text-sm text-gray-600">24/7 Support</span>
						</div>
						<div className="flex items-center">
							<Bot className="h-5 w-5 text-primary mr-2" />
							<span className="text-sm text-gray-600">GPT-4 Powered</span>
						</div>
					</div>
				</div>
				<div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow hidden md:block">
					<Iphone15Pro
						className="mx-auto max-h-[80dvh] w-[22.875rem] max-w-full drop-shadow-xl"
						src={siteConfig.r2.webDemoVideo}
					/>
				</div>
			</div>
			<StatsSection />
		</div>
	);
}
