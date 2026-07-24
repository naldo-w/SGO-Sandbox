import type { PartSlot } from "../../assets/contract";

export interface LayerDefinition {
  id: string;
  name: string;
  zIndex: number;
  partSlots: PartSlot[];
  compatibleRaces?: string[];
}
