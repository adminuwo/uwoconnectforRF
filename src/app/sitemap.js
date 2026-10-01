import { getBaseUrl } from '@/lib/seo';

export default function sitemap() {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  const routes = [
    '',
    '/about',
    '/contact',
    '/features',
    '/pricing',
    '/how-it-works',
    '/platform',
    '/automation',
    '/channels',
    '/connectors',
    '/auth/login',
    '/auth/register',
    '/auth/qr',
    '/auth/forgot-password',
    '/terms',
    '/terms-and-conditions',
    '/privacy',
    '/refund-policy',
    '/cookie-policy',
    '/cookies',
    '/book'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : (route.startsWith('/auth') ? 0.9 : 0.8),
  }));
}
