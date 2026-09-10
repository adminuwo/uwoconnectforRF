import React from 'react';
import AboutClient from '@/components/about/AboutClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getAboutPageSchema,
  getOrganizationSchema,
  getBreadcrumbSchema,
} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About UwoConnect — Enterprise Multi-Channel Automation & AI Workflows',
  description:
    'Discover UwoConnect’s mission to empower modern businesses with intelligent multi-channel customer communications, automated workflows, and enterprise-grade data security.',
  path: '/about',
  keywords: ['About UwoConnect', 'enterprise communication platform', 'Aisa Technologies', 'multi-channel SaaS'],
});

export default function AboutPage() {
  const aboutSchema = getAboutPageSchema();
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'About UwoConnect', url: '/about' },
  ]);

  return (
    <>
      <JsonLd id="schema-about" data={aboutSchema} />
      <JsonLd id="schema-org-about" data={orgSchema} />
      <JsonLd id="schema-breadcrumb-about" data={breadcrumbSchema} />
      <AboutClient />
    </>
  );
}
