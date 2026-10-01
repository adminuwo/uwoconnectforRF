/**
 * Centralized SEO, GEO, and Schema.org Structured Data Architecture
 * UwoConnect SaaS Platform
 */

export const SITE_CONFIG = {
  name: 'UWO Connect',
  legalName: 'UWO Connect / Aisa Technologies',
  tagline: 'Connect Everything. Automate Anything.',
  defaultTitle: 'UWO Connect — AI-Powered Multi-Channel Business Automation & CRM Platform',
  titleTemplate: '%s | UWO Connect',
  defaultDescription:
    'Enterprise multi-channel automation platform connecting WhatsApp Business API, Instagram, Facebook, Gmail, and Outlook with AI agents, automated workflow routing, CRM pipelines, and smart invoicing.',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'uwoconnect.aisa24.com',
  defaultLocale: 'en_US',
  themeColor: '#030712',
  brandColor: '#059669',
  supportEmail: 'support@uwo24.com',
  verifyEmail: 'verify@uwo24.com',
  adminEmail: 'admin@uwo24.com',
  phone: '+91 98765 43210',
  address: {
    streetAddress: 'Tech Park Tower, Sector 62',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201309',
    addressCountry: 'IN',
  },
  openingHours: 'Mo-Sa 09:00-19:00',
  socialProfiles: [
    'https://www.instagram.com/aimall.global/',
    'https://www.linkedin.com/in/aimall-global/',
    'https://x.com/aimallglobal',
    'https://www.youtube.com/@aimallglobal',
    'https://in.pinterest.com/aimallglobal/',
    'https://www.facebook.com/aimallglobal/',
    'https://api.whatsapp.com/send?phone=918359890909',
    'https://www.threads.net/@aimallglobal',
  ],
  keywords: [
    'UWO Connect',
    'WhatsApp Business API automation',
    'multi-channel business automation',
    'AI customer service agents',
    'Instagram DM automation',
    'Facebook Messenger automation',
    'CRM sales pipeline software',
    'visual workflow builder',
    'GST invoice generator',
    'digital product catalog WhatsApp',
    'Razorpay PhonePe UPI payment links',
    'enterprise communication SaaS',
  ],
};

/**
 * Returns the canonical base URL without trailing slash.
 */
export function getBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    'https://uwoconnect.aisa24.com';
  return envUrl.replace(/\/+$/, '');
}

/**
 * Standardized canonical URL generator.
 */
export function getCanonicalUrl(path = '') {
  const base = getBaseUrl();
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`).replace(/\/+$/, '') : '';
  return `${base}${cleanPath}`;
}

/**
 * Helper to build comprehensive Next.js Page Metadata.
 */
export function buildPageMetadata({
  title,
  description,
  path = '',
  image = '/hero_bg_pattern.png',
  robots = { index: true, follow: true },
  keywords = [],
  type = 'website',
}) {
  const canonicalUrl = getCanonicalUrl(path);
  const pageTitle = title || SITE_CONFIG.defaultTitle;
  const pageDescription = description || SITE_CONFIG.defaultDescription;
  const ogImageUrl = image.startsWith('http') ? image : `${getBaseUrl()}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...SITE_CONFIG.keywords, ...keywords].join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: robots.index !== false,
      follow: robots.follow !== false,
      nocache: false,
      googleBot: {
        index: robots.index !== false,
        follow: robots.follow !== false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.defaultLocale,
      type: type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${pageTitle} — ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImageUrl],
      creator: '@aimallglobal',
      site: '@aimallglobal',
    },
  };
}

/**
 * Schema.org Organization Entity
 */
export function getOrganizationSchema() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/favicon.png`,
      caption: `${SITE_CONFIG.name} Brand Logo`,
    },
    description: SITE_CONFIG.defaultDescription,
    email: SITE_CONFIG.supportEmail,
    telephone: SITE_CONFIG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.phone,
        contactType: 'customer support',
        email: SITE_CONFIG.supportEmail,
        availableLanguage: ['English', 'Hindi'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'https://schema.org/Monday',
            'https://schema.org/Tuesday',
            'https://schema.org/Wednesday',
            'https://schema.org/Thursday',
            'https://schema.org/Friday',
            'https://schema.org/Saturday',
          ],
          opens: '09:00',
          closes: '19:00',
        },
      },
    ],
    sameAs: SITE_CONFIG.socialProfiles,
  };
}

/**
 * Schema.org WebSite Entity
 */
export function getWebSiteSchema() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.defaultDescription,
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    inLanguage: 'en-US',
  };
}

/**
 * Schema.org SoftwareApplication / WebApplication with authentic plans & pricing
 */
export function getSoftwareApplicationSchema() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${baseUrl}/#software`,
    name: SITE_CONFIG.name,
    operatingSystem: 'All (Web Browser, iOS, Android)',
    applicationCategory: 'BusinessApplication',
    softwareVersion: '2.0.0',
    description: SITE_CONFIG.defaultDescription,
    url: baseUrl,
    author: {
      '@id': `${baseUrl}/#organization`,
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Starter Plan',
        price: '499',
        priceCurrency: 'INR',
        priceValidUntil: '2026-12-31',
        billingDuration: 'P1M',
        description: 'Single-channel automation for small businesses with WhatsApp/Instagram/FB inbox and keyword auto-replies.',
        url: `${baseUrl}/#pricing`,
      },
      {
        '@type': 'Offer',
        name: 'Growth Plan',
        price: '1599',
        priceCurrency: 'INR',
        priceValidUntil: '2026-12-31',
        billingDuration: 'P1M',
        description: 'Multi-channel automation across 2 channels with catalog sync, broadcast campaigns, and UPI payments.',
        url: `${baseUrl}/#pricing`,
      },
      {
        '@type': 'Offer',
        name: 'Advanced Plan',
        price: '2499',
        priceCurrency: 'INR',
        priceValidUntil: '2026-12-31',
        billingDuration: 'P1M',
        description: 'Full-featured enterprise suite with autonomous AI agents, multi-team management, branching workflows, and custom webhooks.',
        url: `${baseUrl}/#pricing`,
      },
    ],
    featureList: [
      'Official Meta WhatsApp Business API Cloud Integration',
      'Shared Multi-Agent Team Inbox with Real-Time Sockets',
      'Visual Drag-and-Drop Automation Workflow Builder',
      'Full CRM Pipeline with Stage Progression and Follow-Up Tasks',
      'Interactive WhatsApp Product and Service Catalogs',
      'GST Invoice, Proposal, and Quotation Generation',
      'Razorpay and PhonePe UPI Payment Link Dispatch',
      'In-Browser HD WebRTC Voice and Video Calling',
      'RAG AI Knowledge Document Training for Customer Inquiries',
    ],
  };
}

/**
 * Schema.org FAQPage Entity from authentic landing page FAQs
 */
export function getFAQSchema(customFaqs = null) {
  const defaultFaqs = [
    {
      q: 'What is UWO Connect?',
      a: 'UWO Connect is a unified business communication and automation platform that connects WhatsApp, Instagram, Facebook, Gmail, and Outlook with AI agents, workflow routing, CRM pipelines, and smart invoicing.',
    },
    {
      q: 'Which channels can I connect with UWO Connect?',
      a: 'UWO Connect supports official WhatsApp Business API, Instagram Direct DMs, Facebook Messenger, YouTube comments, Gmail, and Outlook integrations.',
    },
    {
      q: 'What is included in my UWO Connect plan?',
      a: 'Each plan includes a specific allocation of connected channels, team members, automated workflows, knowledge base documents, and broadcast capabilities.',
    },
    {
      q: 'Can I use UWO Connect without coding?',
      a: 'Yes. UWO Connect provides a visual drag-and-drop workflow canvas and zero-code channel connectors designed for business owners and marketing teams.',
    },
    {
      q: 'Can I use AI automation?',
      a: 'Yes. UWO Connect includes intelligent AI Copilot agents trained on your uploaded business PDFs and documents for 24/7 automated lead qualification and customer support.',
    },
    {
      q: 'Can I manage leads and customer follow-ups?',
      a: 'Yes. UWO Connect includes an industrial CRM pipeline with lead stages (New, Qualified, Hot Lead, Follow-Up, Won) and calendar-scheduled follow-up tasks.',
    },
    {
      q: 'Can I create quotations and GST invoices?',
      a: 'Yes. Businesses can generate branded quotations, proposals, and GST tax invoices with 1-click WhatsApp delivery and payment links.',
    },
    {
      q: 'Does UWO Connect offer agency white-label solutions?',
      a: 'Yes. UWO Connect provides multi-tenant white-label workspaces allowing agencies to provision custom branded client portals with dedicated domains and logos.',
    },
  ];

  const faqs = customFaqs || defaultFaqs;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

/**
 * Schema.org BreadcrumbList Entity
 */
export function getBreadcrumbSchema(items = []) {
  const baseUrl = getBaseUrl();
  const listItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    ...items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 2,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };
}

/**
 * Schema.org ContactPage Entity
 */
export function getContactPageSchema() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${baseUrl}/contact#webpage`,
    url: `${baseUrl}/contact`,
    name: 'Contact Support & Sales — UWO Connect',
    description: 'Get in touch with UWO Connect for enterprise support, product onboarding, and WhatsApp Meta API setup.',
    mainEntity: {
      '@id': `${baseUrl}/#organization`,
    },
  };
}

/**
 * Schema.org AboutPage Entity
 */
export function getAboutPageSchema() {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${baseUrl}/about#webpage`,
    url: `${baseUrl}/about`,
    name: 'About UWO Connect — Enterprise Multi-Channel Automation & AI Workflows',
    description: 'Learn about UWO Connect, our enterprise communication architecture, security compliance, and mission.',
    mainEntity: {
      '@id': `${baseUrl}/#organization`,
    },
  };
}
