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
	logging: {
		fetches: {
			fullUrl: true,
			hmrRefreshes: true,
		},
	},
	async redirects() {
		return [
			{
				source: "/affiliate",
				destination: "https://cognova.tolt.io/",
				permanent: false,
			},
		];
	},
};

module.exports = nextConfig;
