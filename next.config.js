/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "**",
			},
		],
		dangerouslyAllowSVG: true,
	},
	// logging: {
	// 	fetches: {
	// 		fullUrl: true,
	// 		hmrRefreshes: true,
	// 	},
	// },
	logging: false,
	experimental: {
		instrumentationHook: true,
	},
};

module.exports = nextConfig;
