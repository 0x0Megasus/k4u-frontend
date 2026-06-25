"use client";

import { useState } from "react";
import Link from "next/link";
import { Channel } from "@/lib/types";

interface ChannelCardProps {
  channel: Channel;
}

function ChannelLogo({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-16 w-16 items-center justify-center border-2 border-[hsl(var(--border))] bg-[hsl(var(--muted))] text-lg font-bold text-[hsl(var(--muted-foreground))]">
        {alt.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-16 w-16 object-contain transition-transform duration-200 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const params = new URLSearchParams({
    name: channel.name,
    ...(channel.logo ? { logo: channel.logo } : {}),
  });

  return (
    <Link
      href={`/watch/${channel.id}?${params}`}
      className="group flex flex-col items-center gap-3 rounded-[2px] border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-all duration-200 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5"
    >
      <ChannelLogo src={channel.logo ?? ""} alt={channel.name} />
      <span className="text-center text-xs font-medium leading-tight text-[hsl(var(--foreground))/90] line-clamp-2">
        {channel.name}
      </span>
    </Link>
  );
}
