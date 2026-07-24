import type { AssetEntry } from "../../assets/contract";
import { inferCategory, inferInventorySubCategory } from "./AssetCategory";
import type { AssetCategory } from "./AssetCategory";

export interface AssetQuery {
  search?: string;
  categoryId?: string;
  subCategory?: string;
  type?: string;
  limit?: number;
  hasAnimation?: boolean;
}

export function queryAssets(
  assets: AssetEntry[],
  query: AssetQuery
): AssetEntry[] {
  let result = [...assets];

  if (query.type) {
    result = result.filter((a) => a.type === query.type);
  }

  if (query.categoryId) {
    result = result.filter((a) => {
      const cat = inferCategory(a.path);
      return cat.id === query.categoryId;
    });
  }

  if (query.subCategory) {
    result = result.filter((a) => {
      const sub = inferInventorySubCategory(a.id, a.path);
      return sub === query.subCategory;
    });
  }

  if (query.hasAnimation) {
    result = result.filter((a) => !!a.animation);
  }

  if (query.search) {
    const q = query.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.path.toLowerCase().includes(q)
    );
  }

  if (query.limit && query.limit > 0) {
    result = result.slice(0, query.limit);
  }

  return result;
}

export function countByCategory(
  assets: AssetEntry[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of assets) {
    const cat = inferCategory(a.path);
    counts[cat.id] = (counts[cat.id] || 0) + 1;
  }
  return counts;
}

export function countBySubCategory(
  assets: AssetEntry[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const a of assets) {
    const sub = inferInventorySubCategory(a.id, a.path);
    counts[sub] = (counts[sub] || 0) + 1;
  }
  return counts;
}

export function findAssetById(
  assets: AssetEntry[],
  id: string
): AssetEntry | undefined {
  return assets.find((a) => a.id === id || a.path.endsWith(id));
}

export function findAssetsByPathPrefix(
  assets: AssetEntry[],
  prefix: string
): AssetEntry[] {
  return assets.filter((a) => a.path.startsWith(prefix));
}
