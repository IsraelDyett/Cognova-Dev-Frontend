import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
	title: "Onboarding",
	description: "Get started by creating the workspace",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 font-geist-sans lg:grid-cols-3 min-h-[100dvh] bg-primary lg:fixed">
			<div className="flex-1 col-span-2 flex items-center justify-center p-4 lg:p-8 bg-background lg:rounded-xl lg:m-4">
				{children}
			</div>

			<div className="hidden relative col-span-1 lg:flex flex-1 items-end p-12">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={siteConfig.r2.logoUrl}
					alt=""
					className="absolute -top-32 -right-32 [200px] opacity-5"
				/>
				<div className="text-primary-foreground space-y-4 z-10 relative">
					<blockquote className="text-lg italic">
						&ldquo;The AI sales agent has been a game-changer for our business. It
						handles customer inquiries 24/7, understands our products perfectly, and
						converts leads better than we expected. The time and resources we&apos;ve
						saved are incredible.&rdquo;
					</blockquote>
					<footer className="text-sm font-medium">- Sarah M., E-commerce Director</footer>
				</div>
			</div>
		</div>
	);
}
