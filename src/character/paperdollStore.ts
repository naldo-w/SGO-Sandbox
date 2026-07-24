import { create } from "zustand";
import { assetLoader } from "../assets/AssetLoader";
import type {
  CharacterConfig,
  CharacterPreset,
  EquipSlot,
  DirectionCode,
  AnimationState,
  LayerState,
} from "./types";
import { defaultConfig, defaultLayerState } from "./types";
import { BUILTIN_PRESETS } from "./presets";
import { DEFAULT_LAYERS } from "../data/layers/defaultLayers";

interface PaperdollState {
  config: CharacterConfig;
  animating: boolean;
  animSpeed: number;
  animFrame: number;
  layerStates: Record<string, LayerState>;
  presets: CharacterPreset[];
  customPresets: CharacterPreset[];

  setLayer: (layerId: string, assetPath: string | undefined) => void;
  clearLayer: (layerId: string) => void;
  setDirection: (dir: DirectionCode) => void;
  setAnimation: (anim: AnimationState) => void;
  setRace: (race: string) => void;
  setGender: (gender: string) => void;
  setBody: (body: string) => void;
  setName: (name: string) => void;
  setAnimating: (v: boolean) => void;
  setAnimSpeed: (s: number) => void;
  setAnimFrame: (f: number) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setLayerAlpha: (layerId: string, alpha: number) => void;
  loadPreset: (preset: CharacterPreset) => void;
  savePreset: (name: string) => void;
  deletePreset: (name: string) => void;
  loadConfig: (cfg: CharacterConfig) => void;
  reset: () => void;
}

function makeLayerStates(): Record<string, LayerState> {
  const states: Record<string, LayerState> = {};
  for (const layer of DEFAULT_LAYERS) {
    states[layer.id] = { visible: true, alpha: 1 };
  }
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

  setLayer: (layerId, assetPath) =>
    set((s) => {
      const equipment = { ...s.config.equipment };
      if (assetPath) equipment[layerId] = assetPath;
      else delete equipment[layerId];
      return { config: { ...s.config, equipment } };
    }),

  clearLayer: (layerId) =>
    set((s) => {
      const equipment = { ...s.config.equipment };
      delete equipment[layerId];
      return { config: { ...s.config, equipment } };
    }),

  setDirection: (direction) =>
    set((s) => ({ config: { ...s.config, direction } })),

  setAnimation: (animation) =>
    set((s) => ({ config: { ...s.config, animation } })),

  setRace: (race) =>
    set((s) => ({ config: { ...s.config, race }, layerStates: makeLayerStates() })),

  setGender: (gender) =>
    set((s) => ({ config: { ...s.config, gender } })),

  setBody: (body) =>
    set((s) => ({ config: { ...s.config, body } })),

  setName: (name) =>
    set((s) => ({ config: { ...s.config, name } })),

  setAnimating: (animating) => set({ animating }),
  setAnimSpeed: (animSpeed) => set({ animSpeed }),
  setAnimFrame: (animFrame) => set({ animFrame }),

  setLayerVisibility: (layerId, visible) =>
    set((s) => ({
      layerStates: {
        ...s.layerStates,
        [layerId]: { ...s.layerStates[layerId], visible },
      },
    })),

  setLayerAlpha: (layerId, alpha) =>
    set((s) => ({
      layerStates: {
        ...s.layerStates,
        [layerId]: { ...s.layerStates[layerId], alpha },
      },
    })),

  loadPreset: (preset) =>
    set(() => ({
      config: {
        race: preset.race,
        gender: preset.gender,
        name: preset.name,
        body: preset.body,
        equipment: { ...preset.equipment },
        appearance: {},
        direction: "S",
        animation: "idle",
        expression: "normal",
      },
      layerStates: makeLayerStates(),
    })),

  savePreset: (name) => {
    const { config } = get();
    const newPreset: CharacterPreset = {
      name,
      race: config.race,
      gender: config.gender,
      body: config.body,
      equipment: { ...config.equipment },
    };
    set((s) => ({
      customPresets: [...s.customPresets.filter((p) => p.name !== name), newPreset],
    }));
  },

  deletePreset: (name) =>
    set((s) => ({
      customPresets: s.customPresets.filter((p) => p.name !== name),
    })),

  loadConfig: (cfg) =>
    set({ config: cfg, layerStates: makeLayerStates() }),

  reset: () =>
    set({
      config: defaultConfig(),
      layerStates: makeLayerStates(),
      animating: true,
      animSpeed: 1,
      animFrame: 0,
    }),
}));
