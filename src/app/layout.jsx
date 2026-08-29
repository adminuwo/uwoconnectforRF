import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TourProvider } from "@/context/TourContext";
import { EntitlementProvider } from "@/context/EntitlementContext";
import UpgradeModal from "@/components/common/UpgradeModal";
import AxiosNetworkFixer from "@/components/AxiosNetworkFixer";

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
        {/* Unified Analytics Platform Auto-Tracker */}
        <Script
          id="unified-analytics-tracker"
          strategy="afterInteractive"
          src="https://admin.uwo24.com/api/web-stats/tracker.js"
          data-site="uwoconnect"
          data-endpoint="https://admin.uwo24.com/api/web-stats/collect"
        />
        <AxiosNetworkFixer />
        <EntitlementProvider>
          <TourProvider>
            {children}
            <UpgradeModal />
          </TourProvider>
        </EntitlementProvider>
      </body>
    </html>
  );
}

