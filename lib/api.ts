import { ApiResponse, Category, Channel, MatchEvent, StreamToken } from "./types";

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

const TIMEOUT_MS = 15_000;

async function fetchApi<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(`${getApiBase()}${path}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { success: false, error: "Request timed out" };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

/** Build a proxy URL for HLS streams using a server-side token.
 *
 * The token was created by the backend when the frontend requested stream
 * sources — the real CDN URL never reaches the browser.
 */
export function getStreamProxyUrl(token: string): string {
  return `${getApiBase()}/api/proxy/stream/${encodeURIComponent(token)}`;
}

export function getCategories(): Promise<ApiResponse<Category[]>> {
  return fetchApi<Category[]>("/categories");
}

export function getCategoryChannels(
  categoryId: number
): Promise<ApiResponse<Channel[]>> {
  return fetchApi<Channel[]>(`/categories/${categoryId}/channels`);
}

export function getEvents(): Promise<ApiResponse<MatchEvent[]>> {
  return fetchApi<MatchEvent[]>("/events");
}

export function getStreamSources(
  channelId: number
): Promise<ApiResponse<StreamToken[]>> {
  return fetchApi<StreamToken[]>(`/channel/${channelId}`);
}

export function getEventStreams(
  eventId: number
): Promise<ApiResponse<StreamToken[]>> {
  return fetchApi<StreamToken[]>(`/event/${eventId}`);
}
