"use client";

import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { ArrowLeft, Signal } from "lucide-react";
import { StreamToken } from "@/lib/types";
import { getStreamProxyUrl } from "@/lib/api";

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
  channelName,
  channelLogo,
}: WatchContentProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentSource = sources[selectedIndex];

  const streamUrl = currentSource
    ? getStreamProxyUrl(currentSource.token)
    : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <Link
        href="/browse"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        تصفح
      </Link>

      <div className="space-y-3">
        <VideoPlayer src={streamUrl} poster={channelLogo} />

        {/* Quality selector */}
        {sources.length > 1 && (
          <div className="flex items-center gap-1.5">
            {sources.map((source, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-[2px] border-2 px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  i === selectedIndex
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:border-violet-500/30 hover:text-[hsl(var(--foreground))]"
                }`}
              >
                <Signal className="h-3 w-3" />
                {qualityLabel(source.name)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
