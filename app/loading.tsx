import { MatchCardSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-2 h-9 w-32 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="mb-8 h-5 w-64 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
