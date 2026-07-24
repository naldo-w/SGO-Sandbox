import type { CharacterPreset } from "./types";

export const BUILTIN_PRESETS: CharacterPreset[] = [
  {
    name: "Human Soldier",
    race: "human-male",
    gender: "male",
    body: "Item/IT01_BODY",
    equipment: {
      weapon: "Item/IT00_WEAPON",
      armor: "Item/IT00_ARMOR",
    },
  },
  {
    name: "Elf Archer",
    race: "human-female",
    gender: "female",
    body: "Item/IT02_BODY",
    equipment: {
      weapon: "Item/IT01_WEAPON",
      hair: "Item/IT01_HAIR",
    },
  },
  {
    name: "Dwarf Berserker",
    race: "human-male",
    gender: "male",
    body: "Item/IT01_BODY",
    equipment: {
      weapon: "Item/IT02_WEAPON",
      armor: "Item/IT02_ARMOR",
      accessory: "Item/IT02_CAPE",
    },
  },
  {
    name: "Migu Priestess",
    race: "migu",
    gender: "female",
    body: "Item/IT00_BODY",
    equipment: {
      weapon: "Item/IT00_WEAPON",
      hair: "Item/IT00_HAIR",
    },
  },
  {
    name: "Mech Sentinel",
    race: "mech-spirit",
    gender: "male",
    body: "Item/IT03_BODY",
    equipment: {
      armor: "Item/IT03_ARMOR",
      weapon: "Item/IT03_WEAPON",
    },
  },
  {
    name: "Asian Wanderer",
    race: "asian",
    gender: "male",
    body: "Item/IT04_BODY",
    equipment: {
      weapon: "Item/IT04_WEAPON",
      accessory: "Item/IT04_CAPE",
    },
  },
];
