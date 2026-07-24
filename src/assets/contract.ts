// SGO-Reverse → SGO-Sandbox Asset Contract
// See docs/ASSET_CONTRACT.md for full specification

export interface AssetIndex {
  generated: string;
  assets: AssetEntry[];
}

export interface AssetEntry {
  id: string;
  type: "sprite" | "texture" | "map" | "item" | "palette";
  path: string;
  texture?: string;
  animation?: string;
  metadata?: string;
  dependencies?: string[];
}

export interface Animation {
  name: string;
  frames: Frame[];
  fps: number;
  direction?: string;
  action?: string;
  directions?: Record<string, DirectionEntry>;
}

export interface Frame {
  file: string;
  index: number;
  width: number;
  height: number;
  anchor: [number, number];
}

export interface DirectionEntry {
  dir_ids: number[];
  frame_count: number;
  fps: number;
  action?: string;
  sound?: string;
}

export interface SpriteMetadata {
  source: string;
  original_file: string;
  frames_total: number;
  atlas_w?: number;
  atlas_h?: number;
}

export interface CharacterEntity {
  id: string;
  className: string;
  itemId: string;
  parts: CharacterPart[];
  action: ActionState;
  direction: string;
}

export interface CharacterPart {
  slot: PartSlot;
  spriteId: string;
  animation: Animation;
  anchor: [number, number];
}

export type PartSlot =
  | "Back" | "Leg" | "R-Arm" | "Body" | "L-Arm"
  | "R-Shoulder" | "L-Shoulder" | "Bonnet";

export type ActionState =
  | "idle" | "walk" | "attack" | "hit" | "death" | "skill" | "run";

export interface MapResource {
  id: string;
  width: number;
  height: number;
  tileSize: number;
  tiles: number[][];
  tileAtlas: string;
  objects: MapObject[];
  blocking: boolean[][];
}

export interface MapObject {
  id: number;
  sprFile: string;
  x: number;
  y: number;
  z: number;
  scale: number;
}

export interface EffectResource {
  id: string;
  type: "skill" | "hit" | "buff" | "weapon";
  animation: Animation;
  attachPoint?: string;
  loop: boolean;
  blendMode?: string;
}
