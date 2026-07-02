"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { MatchEvent } from "@/lib/types";

interface MatchListProps {
  events: MatchEvent[];
}

function formatTime(unix: number): string {
  const d = new Date(unix * 1000);
  const h = d.getHours();
  const m = d.getMinutes();
  const isPM = h >= 12;
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
}

function classifyEvents(events: MatchEvent[], now: number) {
  const live: MatchEvent[] = [];
  const upcoming: MatchEvent[] = [];
  const past: MatchEvent[] = [];
  for (const e of events) {
    if (now >= e.start_time && now <= e.end_time) {
      live.push(e);
    } else if (now > e.end_time) {
      past.push(e);
    } else {
      upcoming.push(e);
    }
  }
  return { live, upcoming, past };
}

function LogoImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[hsl(var(--muted))] text-[10px] font-bold text-[hsl(var(--muted-foreground))] flex-shrink-0 ${className ?? ""}`}
      >
        {alt.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

function MatchCard({ event, live }: { event: MatchEvent; live: boolean }) {
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams({
      t1: event.team_1.name,
      t2: event.team_2.name,
      l1: event.team_1.logo,
      l2: event.team_2.logo,
      ch: event.champions,
      st: String(event.start_time),
      et: String(event.end_time),
    });
    router.push(`/watch/event/${event.id}?${params}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-[2px] p-4 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 cursor-pointer"
    >
      {/* Tournament + live badge */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          {event.champions}
        </span>
        {live && (
          <span className="inline-flex items-center gap-1 rounded-[2px] border-2 border-green-500/40 bg-green-500/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            مباشر
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2.5 min-w-0">
          <LogoImg
            src={event.team_1.logo}
            alt={event.team_1.name}
            className="h-8 w-8 object-contain flex-shrink-0"
          />
          <span className="text-sm font-semibold leading-tight truncate">
            {event.team_1.name}
          </span>
        </div>

        <div className="flex-shrink-0 text-center px-1">
          {live ? (
            <span className="text-xs font-bold text-[hsl(var(--muted-foreground))]">
              ضد
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold tabular-nums tracking-tight text-[hsl(var(--muted-foreground))]">
                {formatTime(event.start_time)}
              </span>

            </div>
          )}
        </div>

        <div className="flex flex-1 items-center gap-2.5 min-w-0 justify-end">
          <span className="text-sm font-semibold leading-tight truncate text-start">
            {event.team_2.name}
          </span>
          <LogoImg
            src={event.team_2.logo}
            alt={event.team_2.name}
            className="h-8 w-8 object-contain flex-shrink-0"
          />
        </div>
      </div>

      {/* Play button - centered */}
      <div className="mt-3 flex items-center justify-center gap-2 border-t-2 border-[hsl(var(--border))] pt-3">
        <span className="inline-flex items-center gap-2 rounded-[2px] border-2 border-violet-500/30 bg-violet-500/5 px-4 py-1.5 text-sm font-bold text-violet-400 transition-all hover:border-violet-500 hover:bg-violet-500/10">
          <Play className="h-4 w-4 fill-violet-400" />
          مشاهدة
        </span>
      </div>

      {/* Footer: commentator + channel */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]">
        {event.commentary ? (
          <span className="truncate">{event.commentary}</span>
        ) : (
          <span />
        )}
        {event.channel && (
          <span className="flex-shrink-0 rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-2 py-0.5 text-[10px] font-semibold tracking-wider">
            {event.channel}
          </span>
        )}
      </div>
    </button>
  );
}

export default function MatchList({ events }: MatchListProps) {
  // SSR-safe: null during server render, classified after hydration
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Math.floor(Date.now() / 1000)); }, []);

  const { live: liveEvents, upcoming: upcomingEvents, past: pastEvents } = useMemo(
    () => classifyEvents(events, now ?? 0),
    [events, now],
  );

  // Sort within each category by start time
  const sortByTime = (a: MatchEvent, b: MatchEvent) => a.start_time - b.start_time;

  return (
    <div className="space-y-8">
      <p className="flex items-center justify-center gap-2 text-sm text-[hsl(var(--muted-foreground))] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] rounded-[2px] px-4 py-3">
        <Play className="h-4 w-4 fill-[hsl(var(--muted-foreground))]" />
        اختر مباراة لفتح صفحة المشاهدة.
      </p>
      {now !== null && liveEvents.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-green-400">
            مباشر الآن
          </h2>
          <div className="space-y-2">
            {[...liveEvents].sort(sortByTime).map((ev) => (
              <MatchCard key={ev.id} event={ev} live={true} />
            ))}
          </div>
        </section>
      )}

      {now !== null && upcomingEvents.length > 0 && (
        <section>
          <h2 className="mb-4 inline-block rounded-[2px] border-2 border-violet-500/20 bg-violet-500/5 px-3 py-1 text-sm font-bold tracking-wider text-violet-300">
            مباريات قادمة
          </h2>
          <div className="space-y-2">
            {[...upcomingEvents].sort(sortByTime).map((ev) => (
              <MatchCard key={ev.id} event={ev} live={false} />
            ))}
          </div>
        </section>
      )}

      {now !== null && pastEvents.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-[hsl(var(--muted-foreground))/50]">
            مباريات انتهت
          </h2>
          <div className="space-y-2 opacity-50">
            {[...pastEvents].sort(sortByTime).map((ev) => (
              <MatchCard key={ev.id} event={ev} live={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
