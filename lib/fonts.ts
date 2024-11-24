// import localFont from "next/font/local";
// export const fontSans = localFont({
// 	variable: "--font-sans",
// 	preload: true,
// 	display: "swap",
// 	src: [
// 		{
// 			path: "../public/fonts/inter-variable.woff2",
// 			weight: "100 900",
// 			style: "normal",
// 		},
// 	],
// });

import { Inter, Roboto_Mono } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
})

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})