"use client";
import { siteConfig } from "@/lib/site";
import Header from "./components/header";
import Footer from "./components/footer";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
	const origin = typeof window !== "undefined" ? window.location.origin : siteConfig.domains.root;
	const botID = process.env.SYS_BOT_ID || "cm3fqhmhh000708job4qfgfpn";
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="mx-auto max-w-7xl px-6 space-y-16 lg:px-8">{children}</main>
			<Footer />
			<script async src={`${origin}/embed.js`} id={botID}></script>
		</div>
	);
};
export default LandingPageLayout;
