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
  title: `${SITE_CONFIG.name} — AI Multi-Channel Automation & CRM Platform`,
  description:
    'Automate customer conversations across WhatsApp, Instagram, and Facebook with AI agents, unified team inbox, CRM pipelines, and instant payments.',
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
