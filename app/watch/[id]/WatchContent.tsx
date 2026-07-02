"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { ArrowLeft, Wifi, WifiLow } from "lucide-react";
import { StreamToken } from "@/lib/types";
import { getStreamProxyUrl } from "@/lib/api";
import { autoSelectIndex, filterQualities } from "@/lib/quality";

interface WatchContentProps {
  sources: StreamToken[];
  channelName: string;
  channelLogo: string;
}

function qualityLabel(name: string): string {
  if (name === "1" || name === "Auto" || name === "auto") return "تلقائي";
  if (name === "Multi") return "متعدد";
  return name;
}

export default function WatchContent({
  sources,
  channelLogo,
}: WatchContentProps) {
  // SSR-safe: filter low quality during render
  const filtered = useMemo(() => filterQualities(sources), [sources]);
  const [selectedIndex, setSelectedIndex] = useState(() => autoSelectIndex(filtered));

  const currentSource = filtered[selectedIndex] ?? filtered[0] ?? null;
  const streamUrl = currentSource
    ? getStreamProxyUrl(currentSource.token)
    : "";

  // When the current source fails (502 from proxy), try the next quality.
  // This handles CDN node failures: if HD is down, auto-fallback to SD.
  // A ref-based counter prevents infinite cycling when all sources are broken.
  const fallbackCountRef = useRef(0);
  const maxFallbacks = filtered.length * 2;
  const handleSourceError = useCallback(() => {
    if (filtered.length <= 1) return; // No other source to try
    fallbackCountRef.current++;
    if (fallbackCountRef.current >= maxFallbacks) {
      // All sources tried twice — let VideoPlayer show its final error
      return;
    }
    setSelectedIndex((prev) => (prev + 1) % filtered.length);
  }, [filtered.length, maxFallbacks]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link
        href="/browse"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        القنوات
      </Link>

      <div className="space-y-3">
        <VideoPlayer
          src={streamUrl}
          poster={channelLogo}
          onSourceError={handleSourceError}
        />

        {/* Quality selector — only SD / HD */}
        {filtered.length > 1 && (
          <div className="flex items-center gap-1.5">
            {filtered.map((source, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-[2px] border-2 px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  i === selectedIndex
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-violet-500/30 hover:text-[hsl(var(--foreground))]"
                }`}
              >
                {i === selectedIndex ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiLow className="h-3 w-3" />
                )}
                {qualityLabel(source.name)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
