import type { AssetEntry } from "../assets/contract";
import type { EquipSlot } from "../character/types";
import { getLayerById } from "../data/layers/defaultLayers";

export interface InventoryItem {
  assetEntry: AssetEntry;
  equipSlot?: EquipSlot;
}

export interface InventoryState {
  items: InventoryItem[];
  search: string;
  selectedCategory: string;
}

export function buildInventory(assets: AssetEntry[]): InventoryItem[] {
  return assets
    .filter((a) => a.type === "sprite")
    .map((a) => {
      const autoSlot = inferEquipSlot(a);
      return { assetEntry: a, equipSlot: autoSlot };
    });
}

function inferEquipSlot(asset: AssetEntry): EquipSlot | undefined {
  const id = asset.id.toLowerCase();
  const path = asset.path.toLowerCase();

  if (id.includes("weapon") || id.includes("w_")) return "weapon";
  if (id.includes("armor") || id.includes("armour") || id.includes("uarmor")) return "armor";
  if (id.includes("hair") || id.includes("_hair")) return "hair";
  if (id.includes("face") || id.includes("_face")) return "face";
  if (id.includes("body") || id.includes("_body")) return "body";
  if (id.includes("cape") || id.includes("back") || id.includes("accessory")) return "accessory";

  return undefined;
}

export function getLayerIdsForItem(item: InventoryItem): string[] {
  if (item.equipSlot) {
    const layer = getLayerById(item.equipSlot);
    if (layer) return [layer.id];
  }
  const defaultLayer = getLayerById("body");
  return defaultLayer ? [defaultLayer.id] : ["body"];
}
