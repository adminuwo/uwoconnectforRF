/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080',
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/terms',
        destination: '/terms-and-conditions',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/cookie-policy',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: 'https://uwo24.com/privacy-policy',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: 'https://uwo24.com/privacy-policy',
        permanent: true,
      },
      {
        source: '/book',
        destination: '/contact',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      backendUrl = `https://${backendUrl}`;
    }
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
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backendUrl}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
