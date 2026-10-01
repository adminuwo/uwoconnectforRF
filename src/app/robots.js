import { getBaseUrl } from '@/lib/seo';

export default function robots() {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/$',
          '/about',
          '/contact',
          '/features',
          '/pricing',
          '/how-it-works',
          '/platform',
          '/automation',
          '/channels',
          '/connectors',
          '/auth/',
          '/terms',
          '/terms-and-conditions',
          '/privacy',
          '/refund-policy',
          '/cookie-policy',
          '/cookies',
          '/book/',
        ],
        disallow: [
          '/client/',
          '/admin/',
          '/dashboard/',
          '/api/',
          '/checkout/',
          '/public/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
