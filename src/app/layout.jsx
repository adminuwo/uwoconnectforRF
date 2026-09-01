import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BrandProvider } from "@/context/BrandContext";
import { TourProvider } from "@/context/TourContext";
import { EntitlementProvider } from "@/context/EntitlementContext";
import UpgradeModal from "@/components/common/UpgradeModal";
import AxiosNetworkFixer from "@/components/AxiosNetworkFixer";

import CookieConsentBanner from "@/components/common/CookieConsentBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "UwoConnect Automation",
  description: "Multi-channel automation platform",
  icons: {
    icon: "/download (3).gif",
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

