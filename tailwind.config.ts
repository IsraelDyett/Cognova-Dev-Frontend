import type { Config } from "tailwindcss";
import { nextui } from '@nextui-org/theme'
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans]
      },
      colors: {}
    }
  },
  plugins: [
    require("tailwindcss-animate"), 
    nextui()
  ]
};
export default config;
