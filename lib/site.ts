import { APP_ORIGIN, R2_URL, ROOT_ORIGIN } from "./config";

const appDescription = "AI-Driven Chat For Smarter Decisions";
export const siteConfig = {
	title: {
		default: "AI-Driven Chat For Smarter Decisions",
		template: `%s | Cognova`,
	},
	icons: {
		icon: "/favicon.ico",
	},
	description: appDescription,
	applicationName: "Cognova",
	keywords: [
		"cognova",
		"cognova ai",
		"chat ai",
		"rag ai",
		"instagram ai",
		"whatsapp ai",
		"pdf ai",
		"chat with your data",
	],
	authors: [{ name: "Cognova" }],
	creator: "Cognova",
	publisher: "Cognova",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title: "Cognova",
		description: appDescription,
		url: process.env.NEXT_PUBLIC_ROOT_URL,
		siteName: "Cognova",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Cognova",
		description: appDescription,
		creator: "@cognovaio",
	},
	r2: {
		logoUrl: `${R2_URL}/logo.png`,
		arrowUrl: `${R2_URL}/vercel-arrow.png`,
		waDemoVideo: `${R2_URL}/wa-demo-video.mp4`,
		webDemoVideo: `${R2_URL}/web-demo-video.mp4`
	},
	domains: {
		app: APP_ORIGIN,
		root: ROOT_ORIGIN,
	},
	links: {
		x: "https://x.com/cognovaio",
		mail: "mailto:cognova.io@gmail.com",
		discord: "https://discord.gg/PEYd3YFY",
	},
};
