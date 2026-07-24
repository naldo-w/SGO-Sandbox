import type { PartSlot } from "../assets/contract";

export type DirectionCode =
  | "S" | "SE" | "E" | "NE"
  | "N" | "NW" | "W" | "SW";

export type AnimationState =
  | "idle" | "walk" | "attack"
  | "hit" | "death" | "skill" | "run";

export interface AssetReference {
  assetId: string;
  anchorOverride?: [number, number];
  scaleOverride?: number;
}

export type EquipSlot = "body" | "face" | "hair" | "armor" | "weapon" | "accessory";

export const EQUIP_SLOTS: EquipSlot[] = [
  "body", "face", "hair", "armor", "weapon", "accessory",
];

export interface LayerState {
  visible: boolean;
  alpha: number;
}

export interface CharacterConfig {
  race: string;
  body: string;
  layers: Partial<Record<EquipSlot, AssetReference>>;
  direction: DirectionCode;
  animation: AnimationState;
}

export interface CharacterPreset {
  name: string;
  race: string;
  body: string;
  layers: Partial<Record<EquipSlot, AssetReference>>;
}

export interface ResolvedLayer {
  renderSlot: PartSlot;
  assetRef: AssetReference;
}

const FALLBACK_LAYER: AssetReference = { assetId: "" };

export const EQUIP_TO_RENDER: Record<EquipSlot, PartSlot[]> = {
  body:      ["Body"],
  face:      ["Bonnet"],
  hair:      ["Bonnet"],
  armor:     ["Leg", "R-Arm", "Body", "L-Arm", "R-Shoulder", "L-Shoulder"],
  weapon:    ["R-Arm"],
  accessory: ["Back"],
};

export function resolveLayers(config: CharacterConfig): ResolvedLayer[] {
  const resolved: ResolvedLayer[] = [];
  for (const [equipSlot, renderSlots] of Object.entries(EQUIP_TO_RENDER)) {
    const ref = config.layers[equipSlot as EquipSlot] ?? FALLBACK_LAYER;
    if (!ref.assetId) continue;
    for (const renderSlot of renderSlots) {
      resolved.push({ renderSlot, assetRef: ref });
    }
  }
  return resolved;
}

export function defaultLayerState(): LayerState {
  return { visible: true, alpha: 1 };
}

export function defaultConfig(): CharacterConfig {
  return {
    race: "human",
    body: "",
    layers: {},
    direction: "S",
    animation: "idle",
  };
}

export const BUILTIN_PRESETS: CharacterPreset[] = [
  {
    name: "Human Soldier",
    race: "human",
    body: "Item/IT00_BODY",
    layers: {
      weapon: { assetId: "Item/IT00_WEAPON" },
      armor:  { assetId: "Item/IT00_ARMOR" },
    },
  },
  {
    name: "Elf Archer",
    race: "elf",
    body: "Item/IT01_BODY",
    layers: {
      weapon: { assetId: "Item/IT01_WEAPON" },
      hair:   { assetId: "Item/IT01_HAIR" },
    },
  },
  {
    name: "Dwarf Berserker",
    race: "dwarf",
    body: "Item/IT02_BODY",
    layers: {
      weapon: { assetId: "Item/IT02_WEAPON" },
      armor:  { assetId: "Item/IT02_ARMOR" },
      accessory: { assetId: "Item/IT02_CAPE" },
    },
  },
];
