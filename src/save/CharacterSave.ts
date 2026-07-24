import type { CharacterDefinition } from "../data/characters/CharacterDefinition";
import { emptyCharacterDefinition } from "../data/characters/CharacterDefinition";

const STORAGE_KEY = "sgo-sandbox-characters";

export function saveCharacter(data: CharacterDefinition): void {
  const saved = { ...data, updated: Date.now() };
  const all = loadAllCharacters();
  const idx = all.findIndex((c) => c.name === data.name && c.race === data.race);
  if (idx >= 0) {
    all[idx] = saved;
  } else {
    all.push(saved);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    console.warn("Failed to save character to localStorage");
  }
}

export function loadCharacter(name: string, race: string): CharacterDefinition | null {
  const all = loadAllCharacters();
  return all.find((c) => c.name === name && c.race === race) ?? null;
}

export function loadAllCharacters(): CharacterDefinition[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CharacterDefinition[];
  } catch {
    return [];
  }
}

export function deleteCharacter(name: string, race: string): void {
  const all = loadAllCharacters().filter(
    (c) => !(c.name === name && c.race === race)
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    console.warn("Failed to delete character from localStorage");
  }
}

export function exportCharacterJSON(data: CharacterDefinition): string {
  return JSON.stringify(data, null, 2);
}

export function importCharacterJSON(json: string): CharacterDefinition {
  const parsed = JSON.parse(json) as Partial<CharacterDefinition>;
  const defaults = emptyCharacterDefinition();
  return {
    ...defaults,
    ...parsed,
    created: parsed.created ?? Date.now(),
    updated: Date.now(),
  };
}
