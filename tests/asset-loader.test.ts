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
  let loader: import("../src/assets/AssetLoader").AssetLoader;

  beforeEach(async () => {
    vi.restoreAllMocks();
    import.meta.env.VITE_GAME_ASSET_PATH = "/GameAssets";
    const mod = await import("../src/assets/AssetLoader");
    loader = mod.assetLoader;
    loader.reset();
  });

  it("loads valid asset.json successfully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    const result = await loader.loadIndex();

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

    const result = await loader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toContain("404");
    expect(result.index).toBeNull();
  });

  it("handles invalid JSON response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error("Unexpected token")),
    });

    const result = await loader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toContain("Invalid JSON");
  });

  it("handles schema mismatch", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(INVALID_INDEX_MISSING_FIELDS),
    });

    const result = await loader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toContain("Schema mismatch");
  });

  it("handles network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await loader.loadIndex();

    expect(result.status).toBe("error");
    expect(result.error).toBe("Network error");
  });

  it("caches loaded index and provides lookup", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    await loader.loadIndex();

    const asset = loader.getAsset("Enemy/EN050B");
    expect(asset).not.toBeNull();
    expect(asset!.type).toBe("sprite");

    const missing = loader.getAsset("nonexistent");
    expect(missing).toBeNull();
  });

  it("supports search by id", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    await loader.loadIndex();

    const results = loader.search("EN050B");
    expect(results.length).toBe(1);

    const noResults = loader.search("zzzzz");
    expect(noResults.length).toBe(0);
  });

  it("getCategories returns unique types", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    await loader.loadIndex();

    const cats = loader.getCategories();
    expect(cats).toContain("sprite");
  });

  it("getCategoryCounts returns correct counts", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    await loader.loadIndex();

    const counts = loader.getCategoryCounts();
    expect(counts["sprite"]).toBe(1);
  });

  it("getFrameUrl and getSpriteBaseUrl resolve paths", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    await loader.loadIndex();

    const url = loader.getFrameUrl("sprites/Enemy/EN050B", "frame_000.webp");
    expect(url).toBe("/GameAssets/sprites/Enemy/EN050B/frame_000.webp");
  });

  it("getAssetsByCategory filters correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    await loader.loadIndex();

    const sprites = loader.getAssetsByCategory("sprite");
    expect(sprites.length).toBe(1);

    const maps = loader.getAssetsByCategory("map");
    expect(maps.length).toBe(0);
  });

  it("status reflects load phase", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(VALID_INDEX),
    });

    expect(loader.status).toBe("idle");

    const promise = loader.loadIndex();
    expect(loader.status).toBe("loading");

    await promise;
    expect(loader.status).toBe("success");
  });

  it("error status persists after failed load", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await loader.loadIndex();

    expect(loader.status).toBe("error");
    expect(loader.error).toBe("Network error");
  });
});
