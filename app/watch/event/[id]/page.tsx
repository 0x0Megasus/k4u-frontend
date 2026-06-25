import { getEventStreams } from "@/lib/api";
import EventWatchContent from "./EventWatchContent";
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
  const sp = await searchParams;
  const title = sp?.t1 && sp?.t2
    ? `${sp.t1} vs ${sp.t2} — koora4you`
    : `Match — koora4you`;
  return {
    title,
    description: sp?.ch ? `${sp.ch} live streaming` : "Watch live match streaming",
  };
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

  return (
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
  );
}
