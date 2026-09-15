/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/sales/quotations',
        destination: '/client/quotations',
      },
      {
        source: '/sales/proposals',
        destination: '/client/proposals',
      },
      {
        source: '/sales/proposals/templates',
        destination: '/client/proposals/templates',
      },
      {
        source: '/sales/invoices',
        destination: '/client/invoices',
      },
      {
        source: '/terms-and-condition',
        destination: '/terms-and-conditions',
      },
      {
        source: '/terms-conditions',
        destination: '/terms-and-conditions',
      },
      {
        source: '/terms-of-service',
        destination: '/terms-and-conditions',
      },
      {
        source: '/cookie',
        destination: '/cookie-policy',
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
