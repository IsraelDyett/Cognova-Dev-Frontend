import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = siteConfig;

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "var(--foreground)" },
		{ media: "(prefers-color-scheme: dark)", color: "var(--foreground)" },
	],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />
			<body className={cn("bg-background font-sans antialiased", fontSans.variable)}>
				<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
					{children}
				</Providers>
			</body>
			<GoogleAnalytics gaId="G-VZYF9L974K" />
		</html>
	);
}
