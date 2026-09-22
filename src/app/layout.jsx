import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BrandProvider } from "@/context/BrandContext";
import { TourProvider } from "@/context/TourContext";
import { EntitlementProvider } from "@/context/EntitlementContext";
import UpgradeModal from "@/components/common/UpgradeModal";
import AxiosNetworkFixer from "@/components/AxiosNetworkFixer";
import { getBaseUrl, SITE_CONFIG } from "@/lib/seo";

import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import RouteFontController from "@/components/common/RouteFontController";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: SITE_CONFIG.titleTemplate,
  },
  description: SITE_CONFIG.defaultDescription,
  applicationName: SITE_CONFIG.name,
  authors: [{ name: SITE_CONFIG.name, url: getBaseUrl() }],
  generator: 'Next.js',
  keywords: SITE_CONFIG.keywords,
  referrer: 'origin-when-cross-origin',
  creator: SITE_CONFIG.legalName,
  publisher: SITE_CONFIG.legalName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    url: getBaseUrl(),
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.defaultLocale,
    type: 'website',
    images: [
      {
        url: `${getBaseUrl()}/hero_bg_pattern.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    images: [`${getBaseUrl()}/hero_bg_pattern.png`],
    creator: '@aimallglobal',
    site: '@aimallglobal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans" suppressHydrationWarning>
        <RouteFontController />
        <AxiosNetworkFixer />
        <BrandProvider>
          <EntitlementProvider>
            <TourProvider>
              {children}
              <UpgradeModal />
              <CookieConsentBanner />
            </TourProvider>
          </EntitlementProvider>
        </BrandProvider>
      </body>
    </html>
  );
}

