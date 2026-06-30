import { Suspense } from "react";
import SearchContent from "./SearchContent";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export const metadata = buildSocialMetadata({
  title: "البحث عن قناة",
  description:
    "ابحث بسرعة عن القنوات الرياضية المتاحة داخل Live Koora.",
  path: "/search",
  noindex: true,
});

const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function SearchPage() {
  return (
    <>
      <JsonLd data={searchActionSchema} />
      <Suspense fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="relative mb-8">
            <div className="h-12 w-full animate-pulse rounded-[2px] border-2 border-[hsl(var(--muted))] bg-[hsl(var(--muted))]" />
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </>
  );
}
