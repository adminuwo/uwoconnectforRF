import React from 'react';
import PrivacyClient from '@/components/legal/PrivacyClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getBreadcrumbSchema,
  getBaseUrl,
  SITE_CONFIG,
} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy — UWO Connect™ Data Protection & Security',
  description:
    'Understand how UWO Connect™ securely handles enterprise communication data, WhatsApp Meta API tokens, and protects customer privacy under international data standards.',
  path: '/privacy',
  keywords: ['Privacy Policy', 'data security', 'GDPR compliance', 'WhatsApp API data protection'],
});

export default function PrivacyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Privacy Policy', url: '/privacy' },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getBaseUrl()}/privacy#webpage`,
    url: `${getBaseUrl()}/privacy`,
    name: 'Privacy Policy — UWO Connect™',
    description: 'Privacy policy and data protection terms for UWO Connect™ platform users.',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
  };

  return (
    <>
      <JsonLd id="schema-privacy" data={webPageSchema} />
      <JsonLd id="schema-breadcrumb-privacy" data={breadcrumbSchema} />
      <PrivacyClient />
    </>
  );
}
