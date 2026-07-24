import type { PartSlot } from "../assets/contract";
import type { LayerDefinition } from "../data/layers/LayerDefinition";
import { DEFAULT_LAYERS } from "../data/layers/defaultLayers";

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

export type EquipSlot = string;

export interface LayerState {
  visible: boolean;
  alpha: number;
}

export interface CharacterConfig {
  race: string;
  gender: string;
  name: string;
  body: string;
  equipment: Record<string, string>;
  appearance: Record<string, string>;
  direction: DirectionCode;
  animation: AnimationState;
  expression: string;
}

export interface CharacterPreset {
  name: string;
  race: string;
  gender: string;
  body: string;
  equipment: Record<string, string>;
}

export interface ResolvedLayer {
  renderSlot: PartSlot;
  assetRef: AssetReference;
}

export function resolveLayers(
  equipment: Record<string, string>,
  _race?: string
): ResolvedLayer[] {
  const resolved: ResolvedLayer[] = [];
  const layerMap = buildLayerPartMap();

  for (const [layerId, assetPath] of Object.entries(equipment)) {
    if (!assetPath) continue;
    const partSlots = layerMap[layerId] ?? inferPartSlots(layerId);
    for (const ps of partSlots) {
      resolved.push({
        renderSlot: ps,
        assetRef: { assetId: assetPath },
      });
    }
  }
  return resolved;
}

function buildLayerPartMap(): Record<string, PartSlot[]> {
  const map: Record<string, PartSlot[]> = {};
  for (const layer of DEFAULT_LAYERS) {
    map[layer.id] = layer.partSlots;
  }
  return map;
}

function inferPartSlots(layerId: string): PartSlot[] {
  if (layerId === "hair" || layerId === "face") return ["Bonnet"];
  if (layerId === "leg") return ["Leg"];
  if (layerId === "body") return ["Body"];
  if (layerId === "armor") return ["Leg", "R-Arm", "Body", "L-Arm", "R-Shoulder", "L-Shoulder"];
  if (layerId === "weapon") return ["R-Arm"];
  if (layerId === "accessory") return ["Back"];
  return ["Body"];
}

export function getLayerOrder(layerIds: string[]): LayerDefinition[] {
  return DEFAULT_LAYERS
    .filter((l) => layerIds.includes(l.id))
    .sort((a, b) => a.zIndex - b.zIndex);
}

export function defaultLayerState(): LayerState {
  return { visible: true, alpha: 1 };
}

export function defaultConfig(): CharacterConfig {
  return {
    race: "human-male",
    gender: "male",
    name: "New Character",
    body: "",
    equipment: {},
    appearance: {},
    direction: "S",
    animation: "idle",
    expression: "normal",
  };
}
