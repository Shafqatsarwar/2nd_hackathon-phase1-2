/** @type {import('next').NextConfig} */
const nextConfig = {
    // Next.js 15+ ignores
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
