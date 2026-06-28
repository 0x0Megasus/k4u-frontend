import { getEvents } from "@/lib/api";
import MatchList from "@/components/MatchList";
import { JsonLd } from "@/components/JsonLd";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildSocialMetadata({
  title: "Live Koora — بث مباشر مباريات اليوم | مشاهدة كورة لايف HD",
  description:
    "شاهد مباريات اليوم بث مباشر على Live Koora. كورة لايف بث مباشر بدون تقطيع HD، متابعة جميع مباريات كرة القدم اليوم live football streaming والنتائج الفورية.",
  path: "/",
});

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Live Koora",
  url: BASE_URL,
  description:
    "شاهد مباريات اليوم بث مباشر. كورة لايف HD بدون تقطيع لمشاهدة جميع مباريات كرة القدم.",
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
          <h1 className="text-3xl font-bold tracking-tight">
            مباريات اليوم بث مباشر — كورة لايف
          </h1>
          <p className="mt-1 text-[hsl(var(--muted-foreground))] text-sm">
            شاهد مباريات كرة القدم اليوم بث مباشر HD، تابع جميع البطولات العالمية والنتائج الفورية
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-[hsl(var(--muted-foreground))]">
            لا توجد مباريات مجدولة اليوم.
          </p>
        ) : (
          <MatchList events={events} />
        )}
      </div>
    </>
  );
}
