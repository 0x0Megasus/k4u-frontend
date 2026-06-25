import { CategoryCardSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-2 h-9 w-32 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="mb-8 h-5 w-64 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
