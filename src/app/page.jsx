import React from 'react';
import HomeClient from '@/components/landing/HomeClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getOrganizationSchema,
  getWebSiteSchema,
  getSoftwareApplicationSchema,
  getFAQSchema,
  SITE_CONFIG,
} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `${SITE_CONFIG.name} — AI-Powered Multi-Channel Business Automation & CRM Platform`,
  description:
    'Scale customer conversations and sales across WhatsApp Business API, Instagram, Facebook, Gmail, and Outlook. Automated visual workflows, AI agents, CRM pipelines, and instant payment links.',
  path: '/',
});

export default function Home() {
  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();
  const softwareSchema = getSoftwareApplicationSchema();
  const faqSchema = getFAQSchema();

  return (
    <>
      <JsonLd id="schema-org" data={orgSchema} />
      <JsonLd id="schema-website" data={webSiteSchema} />
      <JsonLd id="schema-software" data={softwareSchema} />
      <JsonLd id="schema-faq" data={faqSchema} />
      <HomeClient />
    </>
  );
}
