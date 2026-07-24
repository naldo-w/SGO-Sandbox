import { create } from "zustand";
import type { AssetEntry } from "../assets/contract";
import { assetLoader } from "../assets/AssetLoader";
import type { InventoryItem } from "./Inventory";
import { buildInventory } from "./Inventory";

interface InventoryStoreState {
  items: InventoryItem[];
  search: string;
  selectedCategory: string;
  loading: boolean;

  refresh: () => void;
  setSearch: (s: string) => void;
  setCategory: (cat: string) => void;
}

export const useInventoryStore = create<InventoryStoreState>((set, get) => ({
  items: [],
  search: "",
  selectedCategory: "",
  loading: false,

  refresh: () => {
    const idx = assetLoader.getIndex();
    if (!idx) return;
    set({ items: buildInventory(idx.assets), loading: false });
  },

  setSearch: (search) => set({ search }),
  setCategory: (selectedCategory) => set({ selectedCategory }),
}));

export function getFilteredItems(state: InventoryStoreState): InventoryItem[] {
  let result = state.items;
  if (state.selectedCategory) {
    result = result.filter(
      (item) => item.assetEntry.type === state.selectedCategory
    );
  }
  if (state.search) {
    const q = state.search.toLowerCase();
    result = result.filter(
      (item) =>
        item.assetEntry.id.toLowerCase().includes(q) ||
        item.assetEntry.path.toLowerCase().includes(q)
    );
  }
  return result.slice(0, 100);
}
