import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="relative mb-8">
          <div className="h-12 w-full animate-pulse rounded-[2px] border-2 border-[hsl(var(--muted))] bg-[hsl(var(--muted))]" />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
