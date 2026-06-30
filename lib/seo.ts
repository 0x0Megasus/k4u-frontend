import type { Metadata } from "next";

const BASE_URL = "https://www.livekoora.watch";

const SITE_NAME_AR = "Live Koora — مباريات اليوم مباشرة";
const SITE_NAME_EN = "Live Koora — Live Football Streaming";
const DEFAULT_DESC_AR = "مشاهدة مباريات اليوم بث مباشر مجاناً بجودة HD. جدول محدث لمباريات كرة القدم مع القنوات الناقلة وروابط البث المباشر بدون تقطيع. تابع جميع البطولات العالمية والمحلية.";
const DEFAULT_DESC_EN = "Watch today's football matches live streaming free in HD quality. Updated match schedule with TV channels and live broadcast links without buffering.";
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
  ogImageAlt = "Live Koora — مباريات اليوم مباشرة",
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
