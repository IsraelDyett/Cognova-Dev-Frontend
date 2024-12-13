import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import React, { SVGProps } from "react";
import { features } from "./features-section";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { Mail } from "lucide-react";

const footerNavigation = {
	product: [
		{ name: "AI Sales Agent", href: "#agent" },
		{ name: "Instagram Integration", href: "#instagram" },
		{ name: "Web Chat Widget", href: "#webchat" },
		{ name: "Analytics", href: "#analytics" },
	],
	resources: [
		{ name: "Documentation", href: "#docs" },
		{ name: "Blog", href: "#blog" },
	],
	company: [
		{ name: "Pricing", href: "#pricing" },
		{ name: "About Us", href: "#about" },
		{ name: "Privacy Policy", href: "#privacy" },
		{ name: "Terms of Service", href: "#terms" },
	],
	social: [
		{
			name: "E-Mail",
			href: siteConfig.links.mail,
			icon: (props: SVGProps<SVGSVGElement>) => <Mail {...props} />,
		},
		{
			name: "Twitter",
			href: siteConfig.links.x,
			icon: (props: SVGProps<SVGSVGElement>) => <FaTwitter {...props} />,
		},
		{
			name: "Discord",
			href: siteConfig.links.discord,
			icon: (props: SVGProps<SVGSVGElement>) => <FaDiscord {...props} />,
		},
	],
};

export default function Footer() {
	return (
		<footer className="mt-32 bg-gray-900 sm:mt-56" aria-labelledby="footer-heading">
			<div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<div>
						<Logo size="xxl" />
						<h1 className="#text-white text-2xl font-bold pt-4 bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
							{siteConfig.applicationName}
						</h1>
					</div>
					<div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold leading-6 text-white">
									Product
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{footerNavigation.product.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold leading-6 text-white">
									Features
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{features.map((item) => (
										<li key={item.name}>
											<a
												href={"#features"}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold leading-6 text-white">
									Resources
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{footerNavigation.resources.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold leading-6 text-white">
									Company
								</h3>
								<ul role="list" className="mt-6 space-y-4">
									{footerNavigation.company.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="text-sm leading-6 text-gray-300 hover:text-white"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
					<div>
						<h3 className="text-sm font-semibold leading-6 text-white">
							Stay updated with AI sales innovations
						</h3>
						<p className="mt-2 text-sm leading-6 text-gray-300">
							Get the latest updates about AI sales agents, Instagram automation, and
							web chat integration features.
						</p>
					</div>
					<form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
						<label htmlFor="email-address" className="sr-only">
							Email address
						</label>
						<input
							type="email"
							name="email-address"
							id="email-address"
							autoComplete="email"
							required
							className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-56 sm:text-sm sm:leading-6"
							placeholder="Enter your email"
						/>
						<div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
							<Button type="submit">Subscribe</Button>
						</div>
					</form>
				</div>
				<div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
					<div className="flex space-x-6 md:order-2">
						{footerNavigation.social.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="text-gray-500 hover:text-gray-400"
							>
								<span className="sr-only">{item.name}</span>
								<item.icon className="h-6 w-6" aria-hidden="true" />
							</a>
						))}
					</div>
					<p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
						&copy; 2024 {siteConfig.applicationName}, Inc. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
