import type { LayerDefinition } from "../data/layers/LayerDefinition";
import type { RaceDefinition } from "../data/races/RaceDefinition";
import type { PartSlot } from "../assets/contract";

export interface EquipmentAction {
  itemId: string;
  assetPath: string;
  layerIds: string[];
  partSlots: PartSlot[];
}

export interface EquipResult {
  success: boolean;
  error?: string;
  actions: EquipmentAction[];
}

export function resolveEquipActions(
  itemId: string,
  assetPath: string,
  layerIds: string[],
  layers: LayerDefinition[],
  race?: RaceDefinition
): EquipResult {
  if (race) {
    const invalidLayers = layerIds.filter(
      (lid) => !race.availableLayers.includes(lid)
    );
    if (invalidLayers.length > 0) {
      return {
        success: false,
        error: `Item ${itemId} requires layers [${invalidLayers.join(", ")}] not available for race ${race.id}`,
        actions: [],
      };
    }
  }

  const selectedLayers = layers.filter((l) => layerIds.includes(l.id));
  const allSlots = new Set<PartSlot>();
  for (const layer of selectedLayers) {
    for (const ps of layer.partSlots) {
      allSlots.add(ps);
    }
  }

  return {
    success: true,
    actions: [
      {
        itemId,
        assetPath,
        layerIds,
        partSlots: Array.from(allSlots),
      },
    ],
  };
}

export function buildAssetEntry(
  itemId: string,
  assetPath: string
): {
  id: string;
  path: string;
  type: "sprite";
} {
  return {
    id: itemId,
    path: assetPath,
    type: "sprite",
  };
}
