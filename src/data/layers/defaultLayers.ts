import type { LayerDefinition } from "./LayerDefinition";

export const DEFAULT_LAYERS: LayerDefinition[] = [
  { id: "accessory", name: "Accessory", zIndex: 10, partSlots: ["Back"] },
  { id: "leg",       name: "Leg",       zIndex: 20, partSlots: ["Leg"] },
  { id: "body",      name: "Body",      zIndex: 30, partSlots: ["Body"] },
  { id: "r-arm",     name: "R-Arm",     zIndex: 40, partSlots: ["R-Arm"] },
  { id: "l-arm",     name: "L-Arm",     zIndex: 50, partSlots: ["L-Arm"] },
  { id: "r-shoulder",name: "R-Shoulder",zIndex: 60, partSlots: ["R-Shoulder"] },
  { id: "l-shoulder",name: "L-Shoulder",zIndex: 70, partSlots: ["L-Shoulder"] },
  { id: "face",      name: "Face",      zIndex: 80, partSlots: ["Bonnet"] },
  { id: "hair",      name: "Hair",      zIndex: 90, partSlots: ["Bonnet"] },
  { id: "weapon",    name: "Weapon",    zIndex: 100,partSlots: ["R-Arm"] },
  { id: "armor",     name: "Armor",     zIndex: 110,partSlots: ["Leg", "R-Arm", "Body", "L-Arm", "R-Shoulder", "L-Shoulder"] },
];

export function getLayerById(id: string): LayerDefinition | undefined {
  return DEFAULT_LAYERS.find((l) => l.id === id);
}

export function getLayersForRace(raceId: string): LayerDefinition[] {
  return DEFAULT_LAYERS.filter(
    (l) => !l.compatibleRaces || l.compatibleRaces.includes(raceId)
  );
}

export function getSortedLayers(): LayerDefinition[] {
  return [...DEFAULT_LAYERS].sort((a, b) => a.zIndex - b.zIndex);
}
