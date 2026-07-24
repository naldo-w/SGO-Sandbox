import { Texture } from "pixi.js";

export class TextureCache {
  private cache = new Map<string, Texture>();

  async load(path: string): Promise<Texture> {
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }
    const texture = await Texture.from(`GameAssets/${path}`);
    this.cache.set(path, texture);
    return texture;
  }

  get(path: string): Texture | undefined {
    return this.cache.get(path);
  }

  has(path: string): boolean {
    return this.cache.has(path);
  }

  clear(): void {
    this.cache.forEach((t) => t.destroy(true));
    this.cache.clear();
  }
}

export const textureCache = new TextureCache();
