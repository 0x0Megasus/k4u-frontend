import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.livekoora.watch"),
  title: {
    default: "Live Koora — مباريات اليوم مباشرة",
    template: "%s | Live Koora",
  },
  description:
    "تابع مباريات اليوم والقنوات الناقلة في مكان واحد، مع روابط مشاهدة محدثة وتفاصيل واضحة لكل مباراة.",
  keywords: [
    "مباريات اليوم",
    "القنوات الناقلة",
    "بث مباشر مباريات",
    "جدول مباريات اليوم",
    "live football matches",
    "football live streaming",
  ],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "Live Koora",
    title: "Live Koora — مباريات اليوم مباشرة",
    description:
      "تابع مباريات اليوم والقنوات الناقلة في مكان واحد، مع روابط مشاهدة محدثة وتفاصيل واضحة لكل مباراة.",
    url: "https://www.livekoora.watch",
    images: [
      {
        url: "https://www.livekoora.watch/og-default.jpg",
        secureUrl: "https://www.livekoora.watch/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Live Koora — مباريات اليوم مباشرة",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Koora — مباريات اليوم مباشرة",
    description:
      "تابع مباريات اليوم والقنوات الناقلة بروابط مشاهدة محدثة.",
    images: ["https://www.livekoora.watch/og-default.jpg"],
  },
  alternates: {
    canonical: "https://www.livekoora.watch",
    languages: {
      ar: "https://www.livekoora.watch",
      "x-default": "https://www.livekoora.watch",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
    <head>
      <meta name="google-adsense-account" content="ca-pub-4441418851071523"></meta>
    </head>
      <body className={`${cairo.variable} min-h-screen antialiased`}>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4441418851071523"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script
          src="https://pl30124698.effectivecpmnetwork.com/fe/86/f8/fe86f81383b02f92841fc41fa464e5fb.js"
          strategy="afterInteractive"
        />
        <Navbar />
        <main>{children}</main>

        {/* display ad unit_001 — suppressHydrationWarning because AdSense mutates the DOM before hydration */}
        <ins className="adsbygoogle"
             style={{ display: "block" }}
             data-ad-client="ca-pub-4441418851071523"
             data-ad-slot="8436459990"
             data-ad-format="auto"
             data-full-width-responsive="true"
             suppressHydrationWarning></ins>
        <Script id="adsbygoogle-display-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: "(adsbygoogle = window.adsbygoogle || []).push({});"
        }} />
      </body>
    </html>
  );
}
