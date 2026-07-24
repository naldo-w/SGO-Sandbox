import { create } from "zustand";
import type { AssetEntry } from "../assets/contract";
import { assetLoader } from "../assets/AssetLoader";
import type {
  CharacterConfig,
  EquipSlot,
  AssetReference,
  DirectionCode,
  AnimationState,
} from "./types";
import { EQUIP_SLOTS, defaultConfig } from "./types";

interface PaperdollState {
  config: CharacterConfig;
  candidates: Record<EquipSlot, AssetEntry[]>;
  candidateSearch: Record<EquipSlot, string>;

  setLayer: (slot: EquipSlot, ref: AssetReference | undefined) => void;
  clearLayer: (slot: EquipSlot) => void;
  setDirection: (dir: DirectionCode) => void;
  setAnimation: (anim: AnimationState) => void;
  setRace: (race: string) => void;
  setBody: (body: string) => void;
  reset: () => void;
  setCandidateSearch: (slot: EquipSlot, query: string) => void;
  refreshCandidates: (slot: EquipSlot) => void;
  refreshAllCandidates: () => void;
}

export const usePaperdollStore = create<PaperdollState>((set, get) => ({
  config: defaultConfig(),
  candidates: { body: [], face: [], hair: [], armor: [], weapon: [], accessory: [] },
  candidateSearch: { body: "", face: "", hair: "", armor: "", weapon: "", accessory: "" },

  setLayer: (slot, ref) =>
    set((s) => {
      const layers = { ...s.config.layers };
      if (ref) layers[slot] = ref;
      else delete layers[slot];
      return { config: { ...s.config, layers } };
    }),

  clearLayer: (slot) =>
    set((s) => {
      const layers = { ...s.config.layers };
      delete layers[slot];
      return { config: { ...s.config, layers } };
    }),

  setDirection: (direction) =>
    set((s) => ({ config: { ...s.config, direction } })),

  setAnimation: (animation) =>
    set((s) => ({ config: { ...s.config, animation } })),

  setRace: (race) =>
    set((s) => ({ config: { ...s.config, race } })),

  setBody: (body) =>
    set((s) => ({ config: { ...s.config, body } })),

  reset: () => set({ config: defaultConfig() }),

  setCandidateSearch: (slot, query) =>
    set((s) => {
      const candidateSearch = { ...s.candidateSearch, [slot]: query };
      return { candidateSearch };
    }),

  refreshCandidates: (slot) => {
    const state = get();
    const idx = assetLoader.getIndex();
    if (!idx) return;
    const query = state.candidateSearch[slot].toLowerCase();
    const results = idx.assets.filter((a) => {
      if (a.type !== "sprite") return false;
      if (!query) return true;
      return (
        a.id.toLowerCase().includes(query) ||
        a.path.toLowerCase().includes(query)
      );
    });
    set((s) => ({ candidates: { ...s.candidates, [slot]: results } }));
  },

  refreshAllCandidates: () => {
    const idx = assetLoader.getIndex();
    if (!idx) return;
    const results: Partial<Record<EquipSlot, AssetEntry[]>> = {};
    for (const slot of EQUIP_SLOTS) {
      results[slot] = idx.assets.filter((a) => a.type === "sprite");
    }
    set((s) => ({
      candidates: {
        ...s.candidates,
        ...results,
      } as Record<EquipSlot, AssetEntry[]>,
    }));
  },
}));
