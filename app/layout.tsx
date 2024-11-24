import clsx from "clsx";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = siteConfig;

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />
			<body className={clsx("bg-background font-base antialiased", inter.variable)}>
				<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
					{children}
				</Providers>
			</body>
		</html>
	);
}
