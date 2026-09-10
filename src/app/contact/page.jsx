import React from 'react';
import ContactClient from '@/components/contact/ContactClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildPageMetadata,
  getContactPageSchema,
  getOrganizationSchema,
  getBreadcrumbSchema,
  SITE_CONFIG,
} from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact Support & Sales — UwoConnect Platform',
  description:
    'Get in touch with the UwoConnect team for 24/7 technical support, product onboarding, enterprise billing, or WhatsApp Meta API integrations.',
  path: '/contact',
  keywords: ['Contact UwoConnect', 'UwoConnect support', 'WhatsApp API help', 'customer support phone', 'Aisa Technologies contact'],
});

export default function ContactPage() {
  const contactSchema = getContactPageSchema();
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Contact Support', url: '/contact' },
  ]);

  return (
    <>
      <JsonLd id="schema-contact" data={contactSchema} />
      <JsonLd id="schema-org-contact" data={orgSchema} />
      <JsonLd id="schema-breadcrumb-contact" data={breadcrumbSchema} />
      <ContactClient />
    </>
  );
}
