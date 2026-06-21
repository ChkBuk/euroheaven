import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import FloatingChat from "@/components/FloatingChat";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Mercedes-Benz repair Melbourne",
    "Mercedes service Victoria",
    "Mercedes mechanic Melbourne",
    "AMG specialist Melbourne",
    "Mercedes logbook service",
    "Benz repair Melbourne",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og-image.jpg"],
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
  alternates: {
    canonical: site.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans bg-ink-950 text-white" suppressHydrationWarning>
        <StructuredData />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <MobileCTA />
        <FloatingChat />
        <CookieConsent />
      </body>
    </html>
  );
}
