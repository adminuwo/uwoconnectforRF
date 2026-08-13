import { Inter } from "next/font/google";
import "./globals.css";
import { TourProvider } from "@/context/TourContext";
import AxiosNetworkFixer from "@/components/AxiosNetworkFixer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden" style={{ fontFamily: '"Times New Roman", Times, serif' }} suppressHydrationWarning>
        <AxiosNetworkFixer />
        <TourProvider>
          {children}
        </TourProvider>
      </body>
    </html>
  );
}

