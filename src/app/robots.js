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
          '/terms',
          '/privacy',
          '/refund-policy',
          '/cookie-policy',
          '/book/',
        ],
        disallow: [
          '/client/',
          '/admin/',
          '/dashboard/',
          '/api/',
          '/checkout/',
          '/public/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
