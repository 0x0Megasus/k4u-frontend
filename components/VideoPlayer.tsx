"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) {
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    let hls: Hls | null = null;
    let recoveryAttempts = 0;

    const handleCanPlay = () => setLoading(false);
    const handleError = () => {
      setLoading(false);
      setError("تعذر تحميل البث");
    };

    const isHls = src.endsWith(".m3u8") || src.includes("/api/proxy/hls") || src.includes("/api/proxy/stream/");
    if (isHls) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: false,
          lowLatencyMode: false,
          backBufferLength: 30,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          manifestLoadingTimeOut: 15000,
          levelLoadingTimeOut: 15000,
          fragLoadingTimeOut: 30000,
          startLevel: -1,
          debug: false,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;
          console.error("HLS fatal error:", data.type, data.details);

          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            if (data.details === "manifestParsingError") {
              setError("هذا البث غير متاح");
            } else {
              hls?.startLoad();
            }
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            if (recoveryAttempts < 3) {
              recoveryAttempts++;
              hls?.recoverMediaError();
            } else {
              setRetryCount((c) => c + 1);
            }
          } else {
              setError(
                data.details
                  ? `خطأ: ${data.details}`
                  : "فشل تشغيل البث"
              );
            }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("error", handleError);
      } else {
        setLoading(false);
        setError("تشغيل HLS غير مدعوم في هذا المتصفح");
      }
    } else {
      video.src = src;
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("error", handleError);
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      if (hls) hls.destroy();
    };
  }, [src, retryCount]);

  return (
    <div className="relative aspect-video w-full overflow-hidden border-2 border-[hsl(var(--border))] bg-black">
      {!src ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[hsl(var(--muted-foreground))]">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-sm font-bold text-[hsl(var(--muted-foreground))]">لا يوجد بث متاح</p>
        </div>
      ) : (
        <>
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-400" />
                <p className="text-sm font-bold tracking-wide text-violet-300/90">جاري تحميل البث...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}
          <video
            ref={videoRef}
            poster={poster}
            controls
            className="h-full w-full"
            playsInline
          />
        </>
      )}
    </div>
  );
}
