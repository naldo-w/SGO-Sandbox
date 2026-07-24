import { describe, it, expect, vi, beforeEach } from "vitest";

const VALID_INDEX = {
  generated: "2026-07-24T00:00:00+08:00",
  assets: [
    {
      id: "Enemy/EN050B",
      type: "sprite",
      path: "sprites/Enemy/EN050B",
      texture: "sprites/Enemy/EN050B/frames",
      animation: "sprites/Enemy/EN050B/animation.json",
    },
  ],
};

const INVALID_INDEX_MISSING_FIELDS = {
  generated: "2026-07-24T00:00:00+08:00",
  assets: [{ id: "test" }],
};

describe("AssetLoader", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    import.meta.env.VITE_GAME_ASSET_PATH = "/GameAssets";
  });

  it("loads valid asset.json successfully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    const { assetLoader } = await import("../src/assets/AssetLoader");
    const result = await assetLoader.loadIndex();

    expect(result.status).toBe("success");
    expect(result.assetCount).toBe(1);
    expect(result.index?.assets[0].id).toBe("Enemy/EN050B");
  });

  it("handles HTTP error gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const { assetLoader } = await import("../src/assets/AssetLoader");
    const result = await assetLoader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toContain("404");
    expect(result.index).toBeNull();
  });

  it("handles invalid JSON response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("Unexpected token")),
    });

    const { assetLoader } = await import("../src/assets/AssetLoader");
    const result = await assetLoader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toContain("Invalid JSON");
  });

  it("handles schema mismatch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(INVALID_INDEX_MISSING_FIELDS),
    });

    const { assetLoader } = await import("../src/assets/AssetLoader");
    const result = await assetLoader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toContain("Schema mismatch");
  });

  it("handles network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { assetLoader } = await import("../src/assets/AssetLoader");
    const result = await assetLoader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toBe("Network error");
  });

  it("caches loaded index and provides lookup", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    const { assetLoader } = await import("../src/assets/AssetLoader");
    await assetLoader.loadIndex();

    const asset = assetLoader.getAsset("Enemy/EN050B");
    expect(asset).not.toBeNull();
    expect(asset!.type).toBe("sprite");

    const missing = assetLoader.getAsset("nonexistent");
    expect(missing).toBeNull();
  });

  it("supports search by id", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    const { assetLoader } = await import("../src/assets/AssetLoader");
    await assetLoader.loadIndex();

    const results = assetLoader.search("EN050B");
    expect(results.length).toBe(1);

    const noResults = assetLoader.search("zzzzz");
    expect(noResults.length).toBe(0);
  });
});
