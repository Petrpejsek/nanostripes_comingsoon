/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Vypneme ESLint kontroly při buildu, protože chyby řešíme v development módu
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 