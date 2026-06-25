import { VideoPlayerSkeleton } from "@/components/Skeleton";

export default function EventWatchLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 h-4 w-16 animate-pulse rounded bg-[hsl(var(--muted))]" />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <VideoPlayerSkeleton />
          <div className="mt-4">
            <div className="h-7 w-48 animate-pulse rounded bg-[hsl(var(--muted))]" />
          </div>
        </div>
        <div>
          <div className="mb-4 h-6 w-32 animate-pulse rounded bg-[hsl(var(--muted))]" />
          <div className="h-20 animate-pulse rounded-xl bg-[hsl(var(--card))]" />
        </div>
      </div>
    </div>
  );
}
