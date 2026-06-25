import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API Client", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("getCategories calls /categories", async () => {
    const { getCategories } = await import("../lib/api");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [{ id: 1, name: "Sports" }] }),
    });
    const result = await getCategories();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories"),
      expect.anything()
    );
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it("getCategoryChannels calls /categories/{id}/channels", async () => {
    const { getCategoryChannels } = await import("../lib/api");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [{ id: 1, name: "BeIN Sports" }] }),
    });
    const result = await getCategoryChannels(5);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/categories/5/channels"),
      expect.anything()
    );
    expect(result.success).toBe(true);
  });

  it("getStreamSources calls /channel/{id}", async () => {
    const { getStreamSources } = await import("../lib/api");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { name: "Auto", token: "abc123xyz", url_type: 3 },
        ],
      }),
    });
    const result = await getStreamSources(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/channel/1"),
      expect.anything()
    );
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].token).toBe("abc123xyz");
  });

  it("handles HTTP errors gracefully", async () => {
    const { getCategories } = await import("../lib/api");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });
    const result = await getCategories();
    expect(result.success).toBe(false);
    expect(result.error).toContain("500");
  });
});
