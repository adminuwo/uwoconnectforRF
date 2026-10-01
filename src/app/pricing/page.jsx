import React from 'react';
import PricingPage from '@/components/landing/pages/PricingPage';
import { buildPageMetadata, SITE_CONFIG } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `Pricing — UWO Connect Plans for Every Business | ${SITE_CONFIG.name}`,
  description:
    'Compare UWO Connect subscription plans. All plans include AI automation, unified CRM, GST invoicing, WhatsApp API, and 9 business engines. No hidden charges, cancel anytime.',
  path: '/pricing',
});

export default function Page() {
  return <PricingPage />;
}
