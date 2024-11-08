import localFont from "next/font/local";
export const fontSans = localFont({
  variable: "--font-sans",
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
