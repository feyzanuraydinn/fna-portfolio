import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PreferencesProvider } from "@/contexts/PreferencesContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { profile } from "@/data/profile";
import { siteConfig, brandColors } from "@/data/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const title = `${profile.name} | Full Stack Developer`;
const description =
  "Full Stack Developer specialising in React, Next.js, TypeScript and Node.js. " +
  "Selected projects, contact and tools — Feyza Nur Aydın's portfolio.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s | ${profile.name}`,
  },
  description,
  authors: [{ name: profile.name, url: siteConfig.url }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title,
    description,
    siteName: profile.name,
    locale: "tr_TR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: siteConfig.twitterHandle || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const brandStyle = `:root{--primary:${brandColors.primary};--secondary:${brandColors.secondary};}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.defaultLocale} className="dark" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono`}
      >
        <style dangerouslySetInnerHTML={{ __html: brandStyle }} />
        <PreferencesProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </PreferencesProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
