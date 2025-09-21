import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import I18nProvider from '../components/I18nProvider';
import { languages } from '../i18n/config';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgriQuest - Sustainable Farming",
  description: "Gamified platform for sustainable farming practices. Earn points, badges, and rewards by adopting eco-friendly farming methods.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriQuest",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#10B981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Define the language types for the RootLayout props
type RootLayoutProps = {
  children: React.ReactNode;
  params?: Promise<{
    lang: string;
  }> | {
    lang: string;
  };
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // Handle both Promise and resolved params
  let resolvedParams;
  if (params instanceof Promise) {
    resolvedParams = await params;
  } else {
    resolvedParams = params;
  }
  
  return (
    <html lang={resolvedParams?.lang || "en"} className={inter.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AgriQuest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="font-inter bg-slate-50 text-slate-900 min-h-screen agri-bg">
        <I18nProvider>
          <div id="root" className="min-h-screen">
            {children}
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}