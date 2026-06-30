import Link from "next/link";
import { getCategoryChannels, getCategories } from "@/lib/api";
import ChannelCard from "@/components/ChannelCard";
import { JsonLd } from "@/components/JsonLd";
import { buildSocialMetadata, BASE_URL } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  const catsResult = await getCategories();
  const categoryName =
    catsResult.data?.find((c) => c.id === categoryId)?.name ?? "القنوات الرياضية";
  return buildSocialMetadata({
    title: `${categoryName} مباشرة`,
    description: `تصفح قنوات ${categoryName} المتاحة واختر البث المناسب للمشاهدة.`,
    path: `/categories/${id}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) notFound();

  const catsResult = await getCategories();
  const categoryName =
    catsResult.data?.find((c) => c.id === categoryId)?.name ?? "القنوات الرياضية";

  const result = await getCategoryChannels(categoryId);

  if (!result.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[hsl(var(--muted-foreground))]">
          تعذر تحميل القنوات حالياً. حاول مرة أخرى بعد قليل.
        </p>
      </div>
    );
  }

  const channels = result.data ?? [];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Live Koora", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "القنوات الرياضية",
        item: `${BASE_URL}/browse`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `${BASE_URL}/categories/${id}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          href="/browse"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          القنوات الرياضية
        </Link>
        <h1 className="mb-8 text-2xl font-bold tracking-tight">
          {categoryName}
        </h1>

        {channels.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            لا توجد قنوات متاحة في هذا التصنيف حالياً.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {channels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
