import { StreamToken } from "./types";

/** Source names to exclude (low-bitrate, unusable). */
const LOW_NAME_RE = /^(244|240|144)p?$/i;

/** Source name is "multi" (multi-language, causes stuttering). */
const MULTI_RE = /^multi$/i;

/**
 * Higher score = better quality.
 *   100 — Auto
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
 * SSR-safe: filter out low-quality (244P/240P/144P) and Multi streams.
 * No browser APIs — safe during server-side render.
 */
export function filterQualities(sources: StreamToken[]): StreamToken[] {
  return sources.filter(
    (s) => !LOW_NAME_RE.test(s.name.trim()) && !MULTI_RE.test(s.name.trim()),
  );
}

/**
 * Client-only: always pick the best available HD source (1080P > 720P > 576P).
 * Falls back to index 0 if no HD source exists.
 * Call inside useEffect — not during render.
 */
export function autoSelectIndex(filtered: StreamToken[]): number {
  if (filtered.length === 0) return -1;

  // Guard against SSR
  if (typeof navigator === "undefined") return 0;

  // Always pick the best HD source
  const scored = filtered
    .map((s, i) => ({ index: i, score: qualityScore(s.name) }))
    .sort((a, b) => b.score - a.score);

  const bestHd = scored.find((s) => s.score >= HD_THRESHOLD);
  return bestHd?.index ?? scored[0].index;
}
