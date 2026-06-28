import type { Metadata } from "next";

const BASE_URL = "https://www.livekoora.watch";

const SITE_NAME_AR = "Live Koora — بث مباشر مباريات اليوم";
const SITE_NAME_EN = "Live Koora — Live Football Streaming";
const DEFAULT_DESC_AR = "شاهد مباريات اليوم بث مباشر على Live Koora. بث مباشر كورة لايف بدون تقطيع، مشاهدة المباريات HD، ونتائج فورية لجميع البطولات.";
const DEFAULT_DESC_EN = "Watch koora live today matches free in HD streaming. Live football streaming, real-time scores, match schedules, and sports TV online.";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.jpg`;

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
}

export function buildSocialMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = "Live Koora — بث مباشر مباريات اليوم",
  ogType = "website",
  noindex = false,
}: SEOProps): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = `${BASE_URL}${normalizedPath}`;
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;
  const secureImageUrl = imageUrl.replace(/^http:/, "https:");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: ogType,
      siteName: "Live Koora",
      locale: "ar_AR",
      alternateLocale: "en_US",
      images: [
        {
          url: imageUrl,
          secureUrl: secureImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: ogImageAlt }],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export { BASE_URL, SITE_NAME_AR, SITE_NAME_EN, DEFAULT_DESC_AR, DEFAULT_DESC_EN, DEFAULT_OG_IMAGE };
