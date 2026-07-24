import type { AssetEntry, AssetIndex } from "../../assets/contract";
import { assetLoader } from "../../assets/AssetLoader";
import { inferCategory, inferInventorySubCategory } from "./AssetCategory";
import type { AssetCategory } from "./AssetCategory";
import { queryAssets, countByCategory, countBySubCategory } from "./AssetQuery";
import type { AssetQuery } from "./AssetQuery";

export class AssetCatalog {
  private index: AssetIndex | null = null;

  load(): void {
    this.index = assetLoader.getIndex();
  }

  get allAssets(): AssetEntry[] {
    return this.index?.assets ?? [];
  }

  get loaded(): boolean {
    return this.index !== null;
  }

  query(query: AssetQuery): AssetEntry[] {
    return queryAssets(this.allAssets, query);
  }

  getCategories(): { category: AssetCategory; count: number }[] {
    const counts = countByCategory(this.allAssets);
    const entries: { category: AssetCategory; count: number }[] = [];

    for (const [catId, count] of Object.entries(counts)) {
      const cat = inferCategory(catId);
      entries.push({ category: cat, count });
    }

    for (const pattern of [
      { id: "player", name: "Player", pathPrefix: "sprites/Player" },
      { id: "enemy", name: "Enemy", pathPrefix: "sprites/Enemy" },
      { id: "npc", name: "NPC", pathPrefix: "sprites/NPC" },
      { id: "effect", name: "Effect", pathPrefix: "sprites/Effect" },
      { id: "item", name: "Item", pathPrefix: "sprites/Item" },
    ]) {
      if (!entries.find((e) => e.category.id === pattern.id)) {
        entries.push({
          category: {
            id: pattern.id,
            name: pattern.name,
            pathPrefix: pattern.pathPrefix,
            itemType: "sprite",
            subCategory: pattern.id as AssetCategory["subCategory"],
          },
          count: 0,
        });
      }
    }

    return entries.sort((a, b) => b.count - a.count);
  }

  getInventoryCounts(): Record<string, number> {
    const sprites = this.allAssets.filter((a) => a.type === "sprite");
    return countBySubCategory(sprites);
  }

  getRaces(): string[] {
    return ["migu", "human-male", "human-female", "mech-spirit", "asian"];
  }

  getBodyAssets(): AssetEntry[] {
    return this.query({
      subCategory: "body",
      type: "sprite",
      limit: 50,
    });
  }

  getHairAssets(): AssetEntry[] {
    return this.query({
      subCategory: "hair",
      type: "sprite",
      limit: 50,
    });
  }

  getFaceAssets(): AssetEntry[] {
    return this.query({
      subCategory: "face",
      type: "sprite",
      limit: 50,
    });
  }

  getEquipmentAssets(): AssetEntry[] {
    return this.query({
      subCategory: "armor",
      type: "sprite",
      limit: 100,
    });
  }

  getWeaponAssets(): AssetEntry[] {
    return this.query({
      subCategory: "weapon",
      type: "sprite",
      limit: 100,
    });
  }

  getMonsterAssets(): AssetEntry[] {
    return this.query({
      categoryId: "enemy",
      type: "sprite",
      limit: 100,
    });
  }

  getEffectAssets(): AssetEntry[] {
    return this.query({
      categoryId: "effect",
      type: "sprite",
      limit: 100,
    });
  }
}

export const assetCatalog = new AssetCatalog();
