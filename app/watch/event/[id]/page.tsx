import { getEventStreams } from "@/lib/api";
import EventWatchContent from "./EventWatchContent";
import { JsonLd } from "@/components/JsonLd";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";
import { notFound } from "next/navigation";
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
    ? `${sp.ch ? sp.ch + " " : ""}${sp.t1} vs ${sp.t2}`
    : sp?.ch || "مباراة";
  return buildSocialMetadata({
    title: `${eventTitle} — بث مباشر | Live Koora`,
    description: sp?.t1 && sp?.t2
      ? `شاهد ${sp.t1} ضد ${sp.t2}${sp.ch ? ` في ${sp.ch}` : ""} بث مباشر HD. مشاهدة مباريات اليوم كورة لايف بدون تقطيع على Live Koora.`
      : sp?.ch
      ? `شاهد ${sp.ch} بث مباشر HD. مشاهدة مباريات اليوم كورة لايف بدون تقطيع.`
      : `شاهد البث المباشر HD. مشاهدة مباريات اليوم كورة لايف بدون تقطيع.`,
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
            لا توجد بثوث متاحة لهذه المباراة.
          </p>
          <a
            href="/"
            className="text-sm underline underline-offset-4 hover:text-[hsl(var(--foreground))]"
          >
            العودة إلى المباريات
          </a>
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

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
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
