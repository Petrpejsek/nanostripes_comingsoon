/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  experimental: {
    typedRoutes: false,
  },
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: false,
  output: 'standalone',
  trailingSlash: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            happyPackMode: true,
          },
        },
      ],
    });
    return config;
  },
  distDir: '.next',
  generateBuildId: () => 'build',
}

export default nextConfig; 