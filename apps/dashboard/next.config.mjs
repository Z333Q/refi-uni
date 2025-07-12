import tailwindConfig from '../../tailwind.config.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    tailwindConfig,
  },
}
export default nextConfig
