import React from 'react';
import CookiePolicyClient from '@/components/legal/CookiePolicyClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getBreadcrumbSchema,
  getBaseUrl,
  SITE_CONFIG,
} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Cookie Policy & Preferences — UWO Connect',
  description:
    'Learn how UWO Connect uses essential, analytical, and functional cookies to improve workspace performance and provide secure user authentication.',
  path: '/cookies',
  keywords: ['Cookie Policy', 'cookies', 'cookie preferences', 'session cookies', 'tracking settings'],
});

export default function CookiesPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Cookie Policy', url: '/cookies' },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getBaseUrl()}/cookies#webpage`,
    url: `${getBaseUrl()}/cookies`,
    name: 'Cookie Policy — UWO Connect',
    description: 'Cookie policy and consent settings for UWO Connect platform users.',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
  };

  return (
    <>
      <JsonLd id="schema-cookies-alias" data={webPageSchema} />
      <JsonLd id="schema-breadcrumb-cookies-alias" data={breadcrumbSchema} />
      <CookiePolicyClient />
    </>
  );
}
