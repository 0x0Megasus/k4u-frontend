import { getStreamSources } from "@/lib/api";
import WatchContent from "./WatchContent";
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
  searchParams: Promise<{ name?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  const channelName = sp?.name || `القناة ${id}`;
  return buildSocialMetadata({
    title: `${channelName} — بث مباشر | Live Koora`,
    description: `شاهد ${channelName} بث مباشر HD. مشاهدة قنوات كرة القدم اليوم live football streaming على Live Koora.`,
    path: `/watch/${id}`,
  });
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Live Koora", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: channelName,
        item: `${BASE_URL}/watch/${id}`,
      },
    ],
  };

  const broadcastSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BroadcastService",
    name: channelName,
    provider: {
      "@type": "Organization",
      name: "Live Koora",
      url: BASE_URL,
    },
  };
  if (channelLogo) {
    broadcastSchema.image = channelLogo.startsWith("http")
      ? channelLogo
      : `${BASE_URL}${channelLogo}`;
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={broadcastSchema} />
      <WatchContent
        sources={result.data}
        channelName={channelName}
        channelLogo={channelLogo}
      />
    </>
  );
}
