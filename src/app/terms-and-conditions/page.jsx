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
  title: 'Terms & Conditions — UwoConnect Platform',
  description:
    'Review the official UwoConnect terms and conditions, platform service level agreement, user guidelines, and acceptable use policies.',
  path: '/terms-and-conditions',
  keywords: [
    'Terms and Conditions',
    'Terms of Service',
    'UwoConnect legal agreement',
    'acceptable use policy',
    'SaaS terms',
  ],
});

export default function TermsAndConditionsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Terms & Conditions', url: '/terms-and-conditions' },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getBaseUrl()}/terms-and-conditions#webpage`,
    url: `${getBaseUrl()}/terms-and-conditions`,
    name: 'Terms & Conditions — UwoConnect',
    description: 'Official platform usage agreement and terms & conditions for UwoConnect services.',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
  };

  return (
    <>
      <JsonLd id="schema-terms-and-conditions" data={webPageSchema} />
      <JsonLd id="schema-breadcrumb-terms-and-conditions" data={breadcrumbSchema} />
      <TermsClient />
    </>
  );
}
