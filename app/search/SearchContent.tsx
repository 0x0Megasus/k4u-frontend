"use client";

import { useMemo, useState, useEffect } from "react";
import { getCategories, getCategoryChannels } from "@/lib/api";
import { Channel, Category } from "@/lib/types";
import ChannelCard from "@/components/ChannelCard";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(true);
  const [allChannels, setAllChannels] = useState<Channel[]>([]);

  useEffect(() => {
    async function loadAll() {
      try {
        const catsResult = await getCategories();
        if (!catsResult.success || !catsResult.data) return;

        const leafCategories: Category[] = catsResult.data.filter(
          (c) => c.child_count === 0
        );

        const channelPromises = leafCategories.map((cat) =>
          getCategoryChannels(cat.id)
        );
        const settled = await Promise.allSettled(channelPromises);
        const all: Channel[] = settled.flatMap(
          (r) =>
            r.status === "fulfilled" && r.value.success
              ? r.value.data ?? []
              : []
        );
        const seen = new Set<number>();
        setAllChannels(
          all.filter((ch) => {
            if (seen.has(ch.id)) return false;
            seen.add(ch.id);
            return true;
          })
        );
      } catch {
        // Channel loading failed silently
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const q = query.toLowerCase();
    return allChannels.filter((ch) =>
      ch.name.toLowerCase().includes(q)
    );
  }, [query, allChannels]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">البحث عن قناة</h1>
      <p className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
        اكتب اسم القناة للوصول إليها بسرعة.
      </p>

      <style>{`
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-decoration {
          display: none;
        }
        input[type="search"]::-ms-clear,
        input[type="search"]::-ms-reveal {
          display: none;
        }
      `}</style>
      <div className="relative mb-6">
        <SearchIcon className="absolute end-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            router.replace(
              `/search?q=${encodeURIComponent(e.target.value)}`,
              { scroll: false }
            );
          }}
          placeholder="اسم القناة..."
          autoFocus
          className="h-11 w-full rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] ps-9 pe-10 text-sm outline-none transition-all placeholder:text-[hsl(var(--muted-foreground))] focus:border-violet-500/40"
        />
        {query.trim() && (
          <button
            onClick={() => {
              setQuery("");
              router.replace("/search", { scroll: false });
            }}
            className="absolute start-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[2px] text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]/20 hover:text-[hsl(var(--foreground))]"
            aria-label="مسح البحث"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query.trim() && (
        <p className="mb-8 text-sm text-[hsl(var(--muted-foreground))]">
          {loading
            ? "جارٍ البحث..."
            : `${results.length} قناة`}
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      ) : query.trim() && !loading ? (
          <div className="flex min-h-[30vh] items-center justify-center">
          <div className="text-center">
            <SearchIcon className="mx-auto mb-3 h-10 w-10 text-[hsl(var(--muted))]" />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              لم نجد قناة مطابقة لـ &ldquo;{query}&rdquo;.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
