/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/bank-albilad-demo',
  images: {
    unoptimized: true,
    domains: ['jed-s3.bluvalt.com', 'www.bankalbilad.com.sa'],
  },
  trailingSlash: true,
}

module.exports = nextConfig

