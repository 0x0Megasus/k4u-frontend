import type { Metadata } from "next";
import { Cairo } from "next/font/google";
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
    default: "Live Koora — بث مباشر مباريات اليوم | مشاهدة كورة لايف HD",
    template: "%s | Live Koora",
  },
  description:
    "شاهد مباريات اليوم بث مباشر على Live Koora. كورة لايف بث مباشر بدون تقطيع، مشاهدة مباريات كرة القدم HD، متابعة البطولات العالمية والنتائج الفورية.",
  keywords: [
    "koora live today matches", "watch koora live free", "koora live hd streaming",
    "koora live football matches today", "live koora tv matches schedule",
    "koora live streaming without ads", "koora live mobile streaming", "koora live now match",
    "live football streaming", "football live scores", "match today live",
    "sports live tv online", "football fixtures today", "live sports streaming free",
    "HD football stream", "real-time football results",
    "كورة لايف", "بث مباشر كورة لايف", "مشاهدة مباريات اليوم كورة لايف",
    "كورة لايف مباشر", "كورة لايف بدون تقطيع", "مباريات اليوم بث مباشر",
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
    title: "Live Koora — بث مباشر مباريات اليوم | مشاهدة كورة لايف HD",
    description:
      "شاهد مباريات اليوم بث مباشر على Live Koora. كورة لايف بث مباشر بدون تقطيع، مشاهدة مباريات كرة القدم HD، متابعة البطولات العالمية والنتائج الفورية.",
    url: "https://www.livekoora.watch",
    images: [
      {
        url: "https://www.livekoora.watch/og-default.jpg",
        secureUrl: "https://www.livekoora.watch/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Live Koora — بث مباشر مباريات اليوم",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Koora — بث مباشر مباريات اليوم | مشاهدة كورة لايف HD",
    description:
      "شاهد مباريات اليوم بث مباشر على Live Koora. كورة لايف بث مباشر بدون تقطيع.",
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
      <body className={`${cairo.variable} min-h-screen antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
