import { Metadata } from "next";

const appDescription = "AI-Driven Chat For Smarter Decisions";
export const siteConfig: Metadata = {
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
    url: "https://app.cognova.io/",
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
};
