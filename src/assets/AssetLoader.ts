import type { AssetIndex, AssetEntry, Animation, SpriteMetadata } from "./contract";

export type LoadStatus = "idle" | "loading" | "success" | "error";

export interface LoadResult {
  status: LoadStatus;
  index: AssetIndex | null;
  error: string | null;
  assetCount: number;
}

function isAssetIndex(obj: unknown): obj is AssetIndex {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.generated !== "string") return false;
  if (!Array.isArray(o.assets)) return false;
  for (const a of o.assets) {
    if (!a || typeof a !== "object") return false;
    const entry = a as Record<string, unknown>;
    if (typeof entry.id !== "string") return false;
    if (typeof entry.type !== "string") return false;
    if (typeof entry.path !== "string") return false;
  }
  return true;
}

function getAssetPath(): string {
  return import.meta.env.VITE_GAME_ASSET_PATH || "/GameAssets";
}

export class AssetLoader {
  private index: AssetIndex | null = null;
  private animationCache = new Map<string, Animation>();
  private metadataCache = new Map<string, SpriteMetadata>();
  private _status: LoadStatus = "idle";
  private _error: string | null = null;

  get status(): LoadStatus {
    return this._status;
  }

  get error(): string | null {
    return this._error;
  }

  async loadIndex(): Promise<LoadResult> {
    this._status = "loading";
    this._error = null;

    try {
      const base = getAssetPath();
      const res = await fetch(`${base}/asset.json`);

      if (!res.ok) {
        throw new Error(
          `HTTP ${res.status}: ${res.statusText}. ` +
          `Ensure GameAssets is accessible at "${base}/asset.json" ` +
          `(symlink or static hosting).`
        );
      }

      let json: unknown;
      try {
        json = await res.json();
      } catch {
        throw new Error("Invalid JSON response from asset.json");
      }

      if (!isAssetIndex(json)) {
        throw new Error(
          "Schema mismatch: asset.json missing required fields " +
          "(generated, assets[].id, assets[].type, assets[].path)"
        );
      }

      this.index = json;
      this._status = "success";
      return this.getResult();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      this._error = msg;
      this._status = "error";
      this.index = null;
      return this.getResult();
    }
  }

  private getResult(): LoadResult {
    return {
      status: this._status,
      index: this.index,
      error: this._error,
      assetCount: this.index?.assets.length ?? 0,
    };
  }

  getIndex(): AssetIndex | null {
    return this.index;
  }

  getAsset(id: string): AssetEntry | null {
    return this.index?.assets.find((a) => a.id === id) ?? null;
  }

  getAssetsByCategory(type: string): AssetEntry[] {
    if (!this.index) return [];
    return this.index.assets.filter((a) => a.type === type);
  }

  search(query: string): AssetEntry[] {
    if (!this.index) return [];
    const q = query.toLowerCase();
    return this.index.assets.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.path.toLowerCase().includes(q)
    );
  }

  async loadAnimation(spritePath: string): Promise<Animation> {
    if (this.animationCache.has(spritePath)) {
      return this.animationCache.get(spritePath)!;
    }
    const base = getAssetPath();
    const res = await fetch(`${base}/${spritePath}/animation.json`);
    if (!res.ok) throw new Error(`Failed to load animation: ${spritePath}`);
    const anim: Animation = await res.json();
    this.animationCache.set(spritePath, anim);
    return anim;
  }

  async loadMetadata(spritePath: string): Promise<SpriteMetadata | null> {
    if (this.metadataCache.has(spritePath)) {
      return this.metadataCache.get(spritePath)!;
    }
    const base = getAssetPath();
    const res = await fetch(`${base}/${spritePath}/metadata.json`);
    if (!res.ok) return null;
    const meta: SpriteMetadata = await res.json();
    this.metadataCache.set(spritePath, meta);
    return meta;
  }

  getCategoryCounts(): Record<string, number> {
    if (!this.index) return {};
    const counts: Record<string, number> = {};
    for (const a of this.index.assets) {
      counts[a.type] = (counts[a.type] || 0) + 1;
    }
    return counts;
  }
}

export const assetLoader = new AssetLoader();
