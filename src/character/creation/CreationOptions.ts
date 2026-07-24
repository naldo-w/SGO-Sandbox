import { RACES } from "../../data/races/RaceDefinition";
import type { RaceDefinition } from "../../data/races/RaceDefinition";
import type { AssetEntry } from "../../assets/contract";
import { assetCatalog } from "../../data/game/AssetCatalog";

export interface CreationOption<T> {
  value: T;
  label: string;
  previewUrl?: string;
}

export function getRaceOptions(): CreationOption<string>[] {
  return RACES.map((r) => ({
    value: r.id,
    label: r.name,
  }));
}

export function getGenderOptions(raceId: string): CreationOption<string>[] {
  const race = RACES.find((r) => r.id === raceId);
  if (!race) return [{ value: "male", label: "Male" }];
  return race.genders.map((g) => ({ value: g, label: g }));
}

export function getBodyOptions(raceId: string): CreationOption<string>[] {
  const race = RACES.find((r) => r.id === raceId);
  const bodies = assetCatalog.getBodyAssets();
  const raceBodies = bodies.filter((b) => {
    if (!race) return true;
    return b.id.toLowerCase().includes(race.id.replace("-", ""));
  });
  if (raceBodies.length === 0) {
    return [{ value: race?.bodyAsset ?? "Item/IT00_BODY", label: "Default Body" }];
  }
  return raceBodies.map((b) => ({
    value: b.path,
    label: b.id,
  }));
}

export function getFaceOptions(): CreationOption<string>[] {
  const faces = assetCatalog.getFaceAssets();
  if (faces.length === 0) {
    return [{ value: "Item/IT00_FACE", label: "Default Face" }];
  }
  return faces.map((f) => ({
    value: f.path,
    label: f.id,
  }));
}

export function getHairOptions(): CreationOption<string>[] {
  const hairs = assetCatalog.getHairAssets();
  if (hairs.length === 0) {
    return [{ value: "Item/IT00_HAIR", label: "Default Hair" }];
  }
  return hairs.map((h) => ({
    value: h.path,
    label: h.id,
  }));
}

export function getStepLabel(step: string): string {
  const labels: Record<string, string> = {
    "select-race":   "Select Race",
    "select-gender": "Select Gender",
    "select-body":   "Select Body",
    "select-face":   "Select Face",
    "select-hair":   "Select Hair",
    "confirm":       "Confirm Character",
  };
  return labels[step] ?? "Unknown Step";
}

export function stepIndex(step: string): number {
  const order = ["select-race", "select-gender", "select-body", "select-face", "select-hair", "confirm"];
  return order.indexOf(step);
}
