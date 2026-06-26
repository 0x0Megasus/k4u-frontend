"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  isLive?: boolean;
}

export default function VideoPlayer({ src, poster, isLive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);

  // Show loading overlay whenever src changes
  useEffect(() => {
    if (src) setShowLoading(true);
  }, [src]);

  // Clear buffering state on error
  useEffect(() => {
    if (error) setBuffering(false);
  }, [error]);

  // Hide loading when loading finishes (with brief delay for smooth transition)
  // or immediately on error
  useEffect(() => {
    if (error) {
      setShowLoading(false);
    } else if (!loading && src) {
      const t = setTimeout(() => setShowLoading(false), 400);
      return () => clearTimeout(t);
    }
  }, [loading, error, src]);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  // --- HLS logic (exactly as original) ---
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

    const isHls =
      src.endsWith(".m3u8") ||
      src.includes("/api/proxy/hls") ||
      src.includes("/api/proxy/stream/");
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
              data.details ? `خطأ: ${data.details}` : "فشل تشغيل البث",
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

  // --- Controls visibility ---
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (playingRef.current) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 1500);
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    showControls();
  }, [showControls]);

  const handleMouseLeave = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setControlsVisible(false);
  }, []);

  // Keep controls visible when paused
  useEffect(() => {
    if (!playing) {
      setControlsVisible(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }
  }, [playing]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // --- Fullscreen listener ---
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // --- Auto fullscreen on phone rotation ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = () => window.innerWidth < 768;

    const handleOrientationChange = () => {
      if (!isMobile()) return;

      // After a short delay to let the browser settle on the new orientation
      setTimeout(() => {
        if (window.innerHeight < window.innerWidth) {
          // Landscape → enter fullscreen
          if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(() => {});
          }
        } else {
          // Portrait → exit fullscreen
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
        }
      }, 200);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // --- Video event handlers ---
  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  const handleVolumeChange = () => {
    const v = videoRef.current;
    if (v) {
      setVolume(v.volume);
      setMuted(v.muted);
    }
  };

  // --- Volume ---
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = volumeRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.volume = ratio;
    v.muted = ratio === 0;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  // --- Fullscreen ---
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  // --- Play/Pause ---
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${
         isFullscreen ? "!border-0" : "border-2 border-[hsl(var(--border))]"
       } rounded-[2px] bg-black ${
         !controlsVisible && playing ? "cursor-none" : ""
       } ${isFullscreen ? "h-screen" : "aspect-video"}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!src ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[hsl(var(--muted-foreground))]">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <p className="text-sm font-bold text-[hsl(var(--muted-foreground))]">
            لا يوجد بث متاح
          </p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            poster={poster}
            className="h-full w-full object-contain"
            playsInline
            webkit-playsinline="true"
            x5-playsinline="true"
            onPlay={handlePlay}
            onPause={handlePause}
            onWaiting={() => setBuffering(true)}
            onCanPlay={() => setBuffering(false)}
            onPlaying={() => setBuffering(false)}
            onVolumeChange={handleVolumeChange}
            onClick={togglePlay}
          />

          {/* Loading overlay — initial load, re-buffering/poor connection, or glitch/retry */}
          {(showLoading || loading || buffering) && !error && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 transition-opacity duration-300">
              <div className="flex flex-col items-center gap-5">
                {/* Pulsing rings */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-16 w-16 animate-ping rounded-full border-2 border-violet-500/40" />
                  <div className="absolute h-12 w-12 animate-ping rounded-full border-2 border-violet-500/30 [animation-delay:0.3s]" />
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-400" />
                </div>
                <p className="text-sm font-bold tracking-wide text-violet-300/90">
                  {buffering ? "جارٍ الاتصال..." : "جاري تحميل البث..."}
                </p>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Live badge */}
          {isLive && !loading && !error && (
            <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5 rounded bg-black/60 px-2 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-500">مباشر</span>
            </div>
          )}

          {/* Center play overlay when paused */}
          {!showLoading && !error && !playing && (
            <div
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
              onClick={togglePlay}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 transition-transform duration-200 hover:scale-105">
                <Play className="h-8 w-8 fill-white text-white" />
              </div>
            </div>
          )}

          {/* Bottom controls bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out ${
              controlsVisible || !playing
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 pb-3 pt-6">
              {/* Button row */}
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="flex h-8 w-8 items-center justify-center rounded text-white/80 transition-colors hover:text-white"
                >
                  {playing ? (
                    <Pause className="h-4 w-4 fill-white" />
                  ) : (
                    <Play className="h-4 w-4 fill-white" />
                  )}
                </button>

                {/* Live indicator */}
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                  </span>
                  <span className="text-[11px] font-extrabold tracking-wider text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]">
                    LIVE
                  </span>
                </span>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Volume */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleMute}
                    className="flex h-8 w-8 items-center justify-center rounded text-white/80 transition-colors hover:text-white"
                  >
                    {muted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <div
                    ref={volumeRef}
                    className="hidden md:flex h-1 w-16 cursor-pointer rounded-full bg-white/20"
                    onClick={handleVolumeClick}
                  >
                    <div
                      className="h-full rounded-full bg-white/70 transition-all duration-150"
                      style={{ width: `${muted ? 0 : volume * 100}%` }}
                    />
                  </div>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="flex h-8 w-8 items-center justify-center rounded text-white/80 transition-colors hover:text-white"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
