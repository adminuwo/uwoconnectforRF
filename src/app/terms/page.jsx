import React from 'react';
import TermsClient from '@/components/legal/TermsClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getBreadcrumbSchema,
  getBaseUrl,
  SITE_CONFIG,
} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Terms of Service — UWO Connect Platform',
  description:
    'Review the UWO Connect terms of service, platform usage guidelines, SaaS service level agreements, and acceptable use policies.',
  path: '/terms',
  keywords: ['Terms of Service', 'UWO Connect user agreement', 'acceptable use policy', 'SaaS terms'],
});

export default function TermsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Terms of Service', url: '/terms' },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getBaseUrl()}/terms#webpage`,
    url: `${getBaseUrl()}/terms`,
    name: 'Terms of Service — UWO Connect',
    description: 'Platform usage agreement and terms for UWO Connect services.',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
  };

  return (
    <>
      <JsonLd id="schema-terms" data={webPageSchema} />
      <JsonLd id="schema-breadcrumb-terms" data={breadcrumbSchema} />
      <TermsClient />
    </>
  );
}
