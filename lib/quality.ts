import { StreamToken } from "./types";

/** Source names to exclude (low-bitrate, unusable). */
const LOW_NAME_RE = /^(244|240|144)p?$/i;

/**
 * Higher score = better quality.
 *   100 — Auto
 *   90  — Multi
 *   80  — 1080P / 4K / UHD
 *   70  — 720P / HD
 *   60  — 576P
 *   50  — 480P (SD)
 *   40  — 360P (SD)
 *   0   — unknown
 */
function qualityScore(name: string): number {
  const n = name.trim().toLowerCase();
  if (n === "auto" || n === "1") return 100;
  if (n === "multi") return 90;
  if (n.includes("1080") || n.includes("4k") || n.includes("uhd")) return 80;
  if (n.includes("720") || n.includes("hd")) return 70;
  if (n.includes("576")) return 60;
  if (n.includes("480")) return 50;
  if (n.includes("360")) return 40;
  return 0;
}

/** Minimum score to be considered HD. */
const HD_THRESHOLD = 60;

/**
 * SSR-safe: filter out low-quality streams (244P, 240P, 144P).
 * No browser APIs — safe to call during server-side render.
 */
export function filterQualities(sources: StreamToken[]): StreamToken[] {
  return sources.filter((s) => !LOW_NAME_RE.test(s.name.trim()));
}

/**
 * Client-only: pick the best quality index based on navigator.connection.
 * Call inside useEffect — not during render.
 *
 * Fast connection (4g / >=5 Mbps)  → best HD
 * Slow connection                  → best SD, or lowest HD if no SD
 * Unknown                          → best HD
 */
export function autoSelectIndex(filtered: StreamToken[]): number {
  if (filtered.length === 0) return -1;

  // Guard against SSR — navigator is undefined on the server
  if (typeof navigator === "undefined") return 0;

  const conn = (navigator as any).connection as
    | { effectiveType: string; downlink: number }
    | undefined;
  const isFast =
    conn?.effectiveType === "4g" ||
    (conn?.downlink != null && conn.downlink >= 5);

  // Score all sources, sorted descending
  const scored = filtered
    .map((s, i) => ({ index: i, score: qualityScore(s.name) }))
    .sort((a, b) => b.score - a.score);

  if (isFast) return scored[0].index;

  // Slow connection → best SD, or lowest HD if no SD
  const bestSd = scored.find((s) => s.score < HD_THRESHOLD && s.score >= 40);
  if (bestSd) return bestSd.index;

  return scored[scored.length - 1].index;
}
