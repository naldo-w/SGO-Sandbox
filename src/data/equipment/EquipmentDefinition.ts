export interface EquipmentDefinition {
  id: string;
  name: string;
  assetPath: string;
  layerIds: string[];
  compatibleRaces?: string[];
}

export function createEquipmentFromAsset(
  assetId: string,
  assetPath: string,
  layerId: string
): EquipmentDefinition {
  return {
    id: assetId,
    name: assetId.split("/").pop() ?? assetId,
    assetPath,
    layerIds: [layerId],
  };
}

export function defaultEquipmentForRace(raceId: string): EquipmentDefinition[] {
  const generic: EquipmentDefinition[] = [];
  return generic;
}
