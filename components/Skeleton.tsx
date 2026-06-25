export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
      <div className="mx-auto mb-3 h-16 w-16 border-2 border-[hsl(var(--muted))] bg-[hsl(var(--muted))]" />
      <div className="mx-auto h-3 w-20 bg-[hsl(var(--muted))]" />
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <div className="flex h-32 items-center justify-center">
        <div className="h-5 w-24 bg-[hsl(var(--muted))]" />
      </div>
    </div>
  );
}

export function VideoPlayerSkeleton() {
  return (
    <div className="animate-pulse aspect-video w-full rounded-[2px] border-2 border-[hsl(var(--muted))] bg-[hsl(var(--muted))]" />
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 space-y-3">
      <div className="h-3 w-20 bg-[hsl(var(--muted))]" />
      <div className="flex items-center gap-3">
        <div className="flex-1 h-8 bg-[hsl(var(--muted))]" />
        <div className="h-8 w-12 bg-[hsl(var(--muted))]" />
        <div className="flex-1 h-8 bg-[hsl(var(--muted))]" />
      </div>
    </div>
  );
}
