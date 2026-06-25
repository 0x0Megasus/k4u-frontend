import { getStreamSources } from "@/lib/api";
import WatchContent from "./WatchContent";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  const title = sp?.name
    ? `${sp.name} — koora4you`
    : `Channel ${id} — koora4you`;
  return {
    title,
    description: "Watch live TV streaming",
  };
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; logo?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const channelId = parseInt(id, 10);
  if (isNaN(channelId)) notFound();

  const result = await getStreamSources(channelId);

  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-[hsl(var(--muted-foreground))]">
            تعذر تحميل هذه القناة.
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

  const channelName = sp?.name || `Channel ${channelId}`;
  const channelLogo = sp?.logo || "";

  return (
    <WatchContent
      sources={result.data}
      channelName={channelName}
      channelLogo={channelLogo}
    />
  );
}
