import { create } from "zustand";
import type { AssetEntry } from "../assets/contract";
import { assetLoader } from "../assets/AssetLoader";
import type {
  CharacterConfig,
  CharacterPreset,
  EquipSlot,
  AssetReference,
  DirectionCode,
  AnimationState,
  LayerState,
} from "./types";
import {
  EQUIP_SLOTS,
  defaultConfig,
  defaultLayerState,
  BUILTIN_PRESETS,
} from "./types";

interface PaperdollState {
  config: CharacterConfig;
  animating: boolean;
  animSpeed: number;
  animFrame: number;
  layerStates: Record<EquipSlot, LayerState>;
  presets: CharacterPreset[];
  customPresets: CharacterPreset[];
  candidates: Record<EquipSlot, AssetEntry[]>;
  candidateSearch: Record<EquipSlot, string>;

  setLayer: (slot: EquipSlot, ref: AssetReference | undefined) => void;
  clearLayer: (slot: EquipSlot) => void;
  setDirection: (dir: DirectionCode) => void;
  setAnimation: (anim: AnimationState) => void;
  setRace: (race: string) => void;
  setBody: (body: string) => void;
  setAnimating: (v: boolean) => void;
  setAnimSpeed: (s: number) => void;
  setAnimFrame: (f: number) => void;
  setLayerVisibility: (slot: EquipSlot, visible: boolean) => void;
  setLayerAlpha: (slot: EquipSlot, alpha: number) => void;
  loadPreset: (preset: CharacterPreset) => void;
  savePreset: (name: string) => void;
  deletePreset: (name: string) => void;
  reset: () => void;
  setCandidateSearch: (slot: EquipSlot, query: string) => void;
  refreshCandidates: (slot: EquipSlot) => void;
  refreshAllCandidates: () => void;
}

function makeLayerStates(): Record<EquipSlot, LayerState> {
  const states = {} as Record<EquipSlot, LayerState>;
  for (const s of EQUIP_SLOTS) states[s] = defaultLayerState();
  return states;
}

export const usePaperdollStore = create<PaperdollState>((set, get) => ({
  config: defaultConfig(),
  animating: true,
  animSpeed: 1,
  animFrame: 0,
  layerStates: makeLayerStates(),
  presets: BUILTIN_PRESETS,
  customPresets: [],
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

  setAnimating: (animating) => set({ animating }),
  setAnimSpeed: (animSpeed) => set({ animSpeed }),
  setAnimFrame: (animFrame) => set({ animFrame }),

  setLayerVisibility: (slot, visible) =>
    set((s) => ({
      layerStates: {
        ...s.layerStates,
        [slot]: { ...s.layerStates[slot], visible },
      },
    })),

  setLayerAlpha: (slot, alpha) =>
    set((s) => ({
      layerStates: {
        ...s.layerStates,
        [slot]: { ...s.layerStates[slot], alpha },
      },
    })),

  loadPreset: (preset) =>
    set((s) => ({
      config: {
        race: preset.race,
        body: preset.body,
        layers: { ...preset.layers },
        direction: s.config.direction,
        animation: s.config.animation,
      },
      layerStates: makeLayerStates(),
    })),

  savePreset: (name) => {
    const { config } = get();
    const newPreset: CharacterPreset = { name, ...config };
    set((s) => ({
      customPresets: [...s.customPresets.filter((p) => p.name !== name), newPreset],
    }));
  },

  deletePreset: (name) =>
    set((s) => ({
      customPresets: s.customPresets.filter((p) => p.name !== name),
    })),

  reset: () =>
    set({
      config: defaultConfig(),
      layerStates: makeLayerStates(),
      animating: true,
      animSpeed: 1,
      animFrame: 0,
    }),

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
