import type { DirectionCode, AnimationState } from "../../character/types";

export interface EquipmentSlot {
  layerId: string;
  itemId: string;
}

export interface CharacterDefinition {
  race: string;
  gender: string;
  name: string;
  equipment: Record<string, string>;
  appearance: Record<string, string>;
  direction: DirectionCode;
  animation: AnimationState;
  expression: string;
  created: number;
  updated: number;
}

export function emptyCharacterDefinition(): CharacterDefinition {
  return {
    race: "human-male",
    gender: "male",
    name: "New Character",
    equipment: {},
    appearance: {},
    direction: "S",
    animation: "idle",
    expression: "normal",
    created: Date.now(),
    updated: Date.now(),
  };
}
