import { getCategoryChannels } from "@/lib/api";
import ChannelCard from "@/components/ChannelCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Category ${id} — koora4you`,
    description: "Browse live TV channels in this category",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) notFound();

  const result = await getCategoryChannels(categoryId);

  if (!result.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[hsl(var(--muted-foreground))]">
          تعذر تحميل القنوات. حاول مرة أخرى لاحقاً.
        </p>
      </div>
    );
  }

  const channels = result.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">القنوات</h1>

      {channels.length === 0 ? (
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          لا توجد قنوات في هذا التصنيف.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}
    </div>
  );
}
