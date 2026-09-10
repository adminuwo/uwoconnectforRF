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
  title: 'Cookie Policy & Preferences — UwoConnect',
  description:
    'Learn how UwoConnect uses essential, analytical, and functional cookies to improve workspace performance and provide secure user authentication.',
  path: '/cookie-policy',
  keywords: ['Cookie Policy', 'cookie preferences', 'session cookies', 'UwoConnect tracking settings'],
});

export default function CookiePolicyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Cookie Policy', url: '/cookie-policy' },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getBaseUrl()}/cookie-policy#webpage`,
    url: `${getBaseUrl()}/cookie-policy`,
    name: 'Cookie Policy — UwoConnect',
    description: 'Cookie policy and consent settings for UwoConnect platform users.',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
  };

  return (
    <>
      <JsonLd id="schema-cookies" data={webPageSchema} />
      <JsonLd id="schema-breadcrumb-cookies" data={breadcrumbSchema} />
      <CookiePolicyClient />
    </>
  );
}
