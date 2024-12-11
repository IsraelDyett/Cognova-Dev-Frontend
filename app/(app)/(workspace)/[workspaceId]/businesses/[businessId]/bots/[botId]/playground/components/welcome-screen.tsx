import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/site";
import Image from "next/image";
import React from "react";

export default function ChatWelcomeScreen() {
	return (
		<div className="h-screen flex flex-col pb-6">
			<div className="h-full flex flex-col justify-center">
				<div className="-mt-20 max-w-4xl w-full text-center mx-auto px-4 sm:px-6 lg:px-8">
					<Image
						alt="Cognova Logo"
						className="w-28 h-auto mx-auto mb-4"
						width="116"
						height="32"
						src={siteConfig.r2.logoUrl}
					/>

					<h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
						Welcome to {"Business Name"}
					</h1>
					<p className="mt-3 text-gray-600">{"{BUSINESS DESCRIPTION}"}</p>
				</div>

				<div className="mt-10 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
					<div className="relative">
						<Input
							type="text"
							className="p-4 block w-full border-gray-200 rounded-full text-sm"
							placeholder="Ask me anything..."
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
