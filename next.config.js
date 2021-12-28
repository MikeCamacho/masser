/** @type {import('next').NextConfig} */
module.exports = {
	trailingSlash: true,
	reactStrictMode: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
};
