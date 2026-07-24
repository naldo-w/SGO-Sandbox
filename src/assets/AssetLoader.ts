import type { AssetIndex, Animation, SpriteMetadata } from "./contract";

const ASSET_JSON_PATH = "GameAssets/asset.json";

export class AssetLoader {
  private index: AssetIndex | null = null;
  private animationCache = new Map<string, Animation>();
  private metadataCache = new Map<string, SpriteMetadata>();

  async loadIndex(): Promise<AssetIndex> {
    const res = await fetch(ASSET_JSON_PATH);
    if (!res.ok) throw new Error(`Failed to load asset index: ${res.status}`);
    this.index = await res.json();
    return this.index;
  }

  getIndex(): AssetIndex | null {
    return this.index;
  }

  getAsset(id: string) {
    return this.index?.assets.find((a) => a.id === id) ?? null;
  }

  async loadAnimation(spritePath: string): Promise<Animation> {
    if (this.animationCache.has(spritePath)) {
      return this.animationCache.get(spritePath)!;
    }
    const res = await fetch(`GameAssets/${spritePath}/animation.json`);
    if (!res.ok) throw new Error(`Failed to load animation: ${spritePath}`);
    const anim: Animation = await res.json();
    this.animationCache.set(spritePath, anim);
    return anim;
  }

  async loadMetadata(spritePath: string): Promise<SpriteMetadata | null> {
    if (this.metadataCache.has(spritePath)) {
      return this.metadataCache.get(spritePath)!;
    }
    const res = await fetch(`GameAssets/${spritePath}/metadata.json`);
    if (!res.ok) return null;
    const meta: SpriteMetadata = await res.json();
    this.metadataCache.set(spritePath, meta);
    return meta;
  }
}

export const assetLoader = new AssetLoader();
