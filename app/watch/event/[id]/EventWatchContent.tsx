"use client";

import { useEffect, useMemo, useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { ArrowLeft, Trophy, Swords, Clock, Wifi, WifiLow } from "lucide-react";
import { StreamToken } from "@/lib/types";
import { getStreamProxyUrl } from "@/lib/api";
import { autoSelectIndex, filterQualities } from "@/lib/quality";

interface EventWatchContentProps {
  sources: StreamToken[];
  team1: string;
  team2: string;
  logo1: string;
  logo2: string;
  champions: string;
  startTime: number;
  endTime: number;
}

function qualityLabel(name: string): string {
  if (name === "1" || name === "Auto" || name === "auto") return "تلقائي";
  if (name === "Multi") return "متعدد";
  return name;
}

function formatTime(unix: number): string {
  const d = new Date(unix * 1000);
  const h = d.getHours();
  const m = d.getMinutes();
  const isPM = h >= 12;
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}

function LogoImg({ src, alt, size }: { src: string; alt: string; size: number }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className="flex items-center justify-center bg-[hsl(var(--muted))] text-sm font-bold text-[hsl(var(--muted-foreground))] flex-shrink-0 rounded-[2px] border-2 border-[hsl(var(--border))]"
        style={{ width: size, height: size }}
      >
        {alt.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="flex-shrink-0 object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

export default function EventWatchContent({
  sources,
  team1,
  team2,
  logo1,
  logo2,
  champions,
  startTime,
  endTime,
}: EventWatchContentProps) {
  // SSR-safe: filter low quality during render
  const filtered = useMemo(() => filterQualities(sources), [sources]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Client-only: auto-select based on connection speed after mount
  useEffect(() => {
    setSelectedIndex(autoSelectIndex(filtered));
  }, [filtered]);

  const currentSource = filtered[selectedIndex] ?? filtered[0] ?? null;
  const streamUrl = currentSource
    ? getStreamProxyUrl(currentSource.token)
    : "";

  const now = Math.floor(Date.now() / 1000);
  const live = now >= startTime && now <= endTime;
  const upcoming = !live && now < startTime;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        المباريات
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main content */}
        <div className="space-y-4">
          <VideoPlayer src={streamUrl} isLive={live} />

          {/* Match info */}
          <div className="space-y-3 border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-[2px] p-4">
            {champions && (
              <div className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-[hsl(var(--muted-foreground))]">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                {champions}
              </div>
            )}

            {/* Teams row with logos */}
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <LogoImg src={logo1} alt={team1} size={40} />
                <span className="text-base font-bold truncate">{team1}</span>
              </div>

              <div className="flex-shrink-0">
                <span className="flex items-center gap-1 text-xs font-bold text-[hsl(var(--muted-foreground))]">
                  <Swords className="h-3.5 w-3.5" />
                  ضد
                </span>
              </div>

              <div className="flex flex-1 items-center gap-3 min-w-0 justify-end">
                <span className="text-base font-bold truncate text-start">{team2}</span>
                <LogoImg src={logo2} alt={team2} size={40} />
              </div>
            </div>

            {/* Live / Upcoming indicator */}
            {live && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-[11px] font-semibold text-red-400 tracking-wider">
                  مباشر
                </span>
              </div>
            )}
            {upcoming && (
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                <span className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] tracking-wider">
                  يبدأ في {formatTime(startTime)}
                </span>
              </div>
            )}
          </div>

          {/* Quality selector — only SD / HD */}
          {filtered.length > 1 && (
            <div>
              <p className="mb-2 text-[10px] font-semibold tracking-widest text-[hsl(var(--muted-foreground))]">
                الجودة
              </p>
              <div className="flex flex-wrap gap-1.5">
                {filtered.map((source, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-[2px] border-2 px-3 py-1.5 text-[11px] font-semibold transition-all ${
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
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <h2 className="text-[10px] font-semibold tracking-widest text-[hsl(var(--muted-foreground))]">
                تفاصيل المباراة
              </h2>
            </div>
            <div className="mt-3 space-y-2">
              {champions && (
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {champions}
                </p>
              )}

              {/* Teams with logos in sidebar */}
              <div className="pt-2 border-t-2 border-[hsl(var(--border))] space-y-2">
                <div className="flex items-center gap-2">
                  <LogoImg src={logo1} alt={team1} size={24} />
                  <p className="text-sm font-semibold truncate">{team1}</p>
                </div>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] ps-8">ضد</p>
                <div className="flex items-center gap-2">
                  <LogoImg src={logo2} alt={team2} size={24} />
                  <p className="text-sm font-semibold truncate">{team2}</p>
                </div>
              </div>

              {/* Status */}
              <div className="pt-2 border-t-2 border-[hsl(var(--border))]">
                {live && (
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    <span className="text-[11px] font-semibold text-green-400 tracking-wider">مباشر</span>
                  </div>
                )}
                {upcoming && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    يبدأ في {formatTime(startTime)}
                  </p>
                )}
              </div>

              {/* Qualities — only SD / HD */}
              {filtered.length > 0 && live && (
                <div className="pt-2 border-t-2 border-[hsl(var(--border))]">
                  <p className="text-[10px] font-semibold tracking-widest text-[hsl(var(--muted-foreground))]">
                    الجودة
                  </p>
                  <div className="mt-1 space-y-1">
                    {filtered.map((s, i) => (
                      <p
                        key={i}
                        className={`text-xs ${
                          i === selectedIndex
                            ? "text-violet-300 font-semibold"
                            : "text-[hsl(var(--muted-foreground))]"
                        }`}
                      >
                        {qualityLabel(s.name)}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
