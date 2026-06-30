import { getEvents } from "@/lib/api";
import MatchList from "@/components/MatchList";
import { JsonLd } from "@/components/JsonLd";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildSocialMetadata({
  title: "مباريات اليوم مباشرة",
  description:
    "جدول محدث لمباريات اليوم بث مباشر مع روابط المشاهدة والقنوات الناقلة. تابع جميع مباريات كرة القدم اليوم بجودة HD بدون تقطيع.",
  path: "/",
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Live Koora",
  url: BASE_URL,
  description:
    "جدول محدث لمباريات اليوم مع روابط مشاهدة مباشرة والقنوات الناقلة.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function HomePage() {
  const result = await getEvents();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-[hsl(var(--muted-foreground))] text-lg">
          تعذر تحميل مباريات اليوم.
        </p>
      </div>
    );
  }

  const events = result.data ?? [];

  return (
    <>
      <JsonLd data={websiteSchema} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">مباريات اليوم</h1>
          <p className="mt-1 text-[hsl(var(--muted-foreground))] text-sm">
            جدول محدث لأهم المباريات مع حالة البث والقنوات المتاحة.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">
            لا توجد مباريات مدرجة حالياً.
          </p>
        ) : (
          <MatchList events={events} />
        )}
      </div>
    </>
  );
}
