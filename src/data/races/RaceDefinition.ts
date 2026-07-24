export interface RaceDefinition {
  id: string;
  name: string;
  bodyAsset: string;
  genders: string[];
  availableLayers: string[];
  baseLayers: string[];
}

export const RACES: RaceDefinition[] = [
  {
    id: "migu",
    name: "Migu",
    bodyAsset: "Item/IT00_BODY",
    genders: ["female"],
    availableLayers: ["body", "hair", "face", "armor", "weapon", "accessory"],
    baseLayers: ["body"],
  },
  {
    id: "human-male",
    name: "Human Male",
    bodyAsset: "Item/IT01_BODY",
    genders: ["male"],
    availableLayers: ["body", "hair", "face", "armor", "weapon", "accessory"],
    baseLayers: ["body"],
  },
  {
    id: "human-female",
    name: "Human Female",
    bodyAsset: "Item/IT02_BODY",
    genders: ["female"],
    availableLayers: ["body", "hair", "face", "armor", "weapon", "accessory"],
    baseLayers: ["body"],
  },
  {
    id: "mech-spirit",
    name: "Mechanical Spirit",
    bodyAsset: "Item/IT03_BODY",
    genders: ["male", "female"],
    availableLayers: ["body", "armor", "weapon", "accessory"],
    baseLayers: ["body"],
  },
  {
    id: "asian",
    name: "Asian",
    bodyAsset: "Item/IT04_BODY",
    genders: ["male", "female"],
    availableLayers: ["body", "hair", "face", "armor", "weapon", "accessory"],
    baseLayers: ["body"],
  },
];

export function getRaceById(id: string): RaceDefinition | undefined {
  return RACES.find((r) => r.id === id);
}
