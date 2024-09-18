/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    experimental: {
      optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
}

module.exports = nextConfig
