import localFont from "next/font/local";
export const fontSans = localFont({
	variable: "--font-inter-sans",
	preload: true,
	display: "swap",
	src: [
		{
			path: "../public/fonts/inter-variable.woff2",
			weight: "100 900",
			style: "normal",
		},
	],
});

export const geistSans = localFont({
	variable: "--font-geist-sans",
	src: [
		{
			path: "../public/fonts/GeistVF.woff",
			weight: "100 900",
		},
	],
});
