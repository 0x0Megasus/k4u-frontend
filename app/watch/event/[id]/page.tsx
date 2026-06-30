import { getEventStreams } from "@/lib/api";
import EventWatchContent from "./EventWatchContent";
import { JsonLd } from "@/components/JsonLd";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t1?: string; t2?: string; ch?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  const eventTitle = sp?.t1 && sp?.t2
    ? `${sp.t1} ضد ${sp.t2}${sp.ch ? ` - ${sp.ch}` : ""}`
    : sp?.ch || "مباراة";
  return buildSocialMetadata({
    title: `${eventTitle} مباشرة`,
    description: sp?.t1 && sp?.t2
      ? `مشاهدة مباراة ${sp.t1} ضد ${sp.t2}${sp.ch ? ` ضمن ${sp.ch}` : ""} بث مباشر. تابع المباراة بجودة HD مع روابط مشاهدة متعددة ومحدثة.`
      : sp?.ch
      ? `مشاهدة ${sp.ch} بث مباشر. تابع مباريات ${sp.ch} وجميع البطولات بجودة HD.`
      : `شاهد المباراة بث مباشر الآن مع روابط مشاهدة متعددة بجودة HD.`,
    path: `/watch/event/${id}`,
  });
}

export default async function EventWatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    t1?: string; t2?: string;
    l1?: string; l2?: string;
    ch?: string;
    st?: string; et?: string;
  }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const eventId = parseInt(id, 10);
  if (isNaN(eventId)) notFound();

  const result = await getEventStreams(eventId);

  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-[hsl(var(--muted-foreground))]">
            لا توجد مصادر مشاهدة متاحة لهذه المباراة حالياً.
          </p>
          <Link
            href="/"
            className="text-sm underline underline-offset-4 hover:text-[hsl(var(--foreground))]"
          >
            العودة إلى المباريات
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Live Koora", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: sp?.ch || "مباراة",
        item: `${BASE_URL}/watch/event/${id}`,
      },
    ],
  };

  const eventSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: sp?.t1 && sp?.t2
      ? `${sp.t1} ضد ${sp.t2}${sp.ch ? ` - ${sp.ch}` : ""}`
      : sp?.ch || "مباراة",
    ...(sp?.st && {
      startDate: new Date(parseInt(sp.st, 10) * 1000).toISOString(),
    }),
    ...(sp?.et && {
      endDate: new Date(parseInt(sp.et, 10) * 1000).toISOString(),
    }),
  };
  if (sp?.t1 || sp?.t2) {
    eventSchema.competitor = [
      ...(sp?.t1 ? [{ "@type": "SportsTeam" as const, name: sp.t1 }] : []),
      ...(sp?.t2 ? [{ "@type": "SportsTeam" as const, name: sp.t2 }] : []),
    ];
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={eventSchema} />
      <EventWatchContent
        sources={result.data}
        team1={sp?.t1 || ""}
        team2={sp?.t2 || ""}
        logo1={sp?.l1 || ""}
        logo2={sp?.l2 || ""}
        champions={sp?.ch || ""}
        startTime={sp?.st ? parseInt(sp.st, 10) : 0}
        endTime={sp?.et ? parseInt(sp.et, 10) : 0}
      />
    </>
  );
}
