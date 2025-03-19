import { APP_ORIGIN, R2_URL, ROOT_ORIGIN } from "./config";

const appDescription = "AI-Driven Chat For Smarter Decisions";
export const siteConfig = {
	title: {
		default: "AI-Driven Chat For Smarter Decisions",
		template: `%s | Cognova AI`,
	},
	icons: {
		icon: "/favicon.ico",
	},
	description: appDescription,
	applicationName: "Cognova AI", 
	keywords: [
		"cognova",
		"cognova ai",
		"cognova io", 
		"cognovaio",
		"cognova chat",
		"chat ai",
		"rag ai",
		"instagram ai",
		"whatsapp ai",
		"pdf ai",
		"chat with your data",
		"ai chatbot",
		"business ai",
		"customer support ai",
		"ai assistant",
		"conversational ai",
		"ai automation",
		"sales ai",
		"ai customer service",
		"intelligent chat",
		"automated chat",
		"ai messaging",
		"smart chat",
		"business automation",
		"customer engagement",
		"ai powered chat",
		"virtual assistant",
		"chatbot platform",
		"ai support",
		"business intelligence"
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
		webDemoVideo: `${R2_URL}/web-demo-video.mp4`,
	},
	domains: {
		app: APP_ORIGIN,
		root: ROOT_ORIGIN,
	},
	links: {
		x: "https://x.com/cognovaio",
		mail: "mailto:support@cognova.io",
		discord: "https://discord.gg/tDdn4F2dS3",
	},
};
