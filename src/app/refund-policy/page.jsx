import React from 'react';
import RefundPolicyClient from '@/components/legal/RefundPolicyClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getBreadcrumbSchema,
  getBaseUrl,
  SITE_CONFIG,
} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Cancellation & Refund Policy — UWO Connect',
  description:
    'Read UWO Connect’s 7-day money-back guarantee, subscription cancellation terms, and refund eligibility guidelines for all workspace plans.',
  path: '/refund-policy',
  keywords: ['Refund Policy', 'money back guarantee', 'subscription cancellation', 'UWO Connect refund'],
});

export default function RefundPolicyPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Cancellation & Refund Policy', url: '/refund-policy' },
  ]);

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${getBaseUrl()}/refund-policy#webpage`,
    url: `${getBaseUrl()}/refund-policy`,
    name: 'Cancellation & Refund Policy — UWO Connect',
    description: '7-day money-back guarantee and subscription refund terms for UWO Connect customers.',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
  };

  return (
    <>
      <JsonLd id="schema-refund" data={webPageSchema} />
      <JsonLd id="schema-breadcrumb-refund" data={breadcrumbSchema} />
      <RefundPolicyClient />
    </>
  );
}
