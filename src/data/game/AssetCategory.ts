export interface AssetCategory {
  id: string;
  name: string;
  pathPrefix: string;
  itemType: "sprite" | "texture" | "map" | "item" | "palette";
  subCategory: "armor" | "weapon" | "head" | "face" | "hair" | "back"
    | "body" | "monster" | "npc" | "player" | "effect" | "ma"
    | "ms" | "sr" | "interface" | "map-anim" | "unknown";
}

export const CATEGORY_PATTERNS: AssetCategory[] = [
  { id: "player",       name: "Player",      pathPrefix: "sprites/Player",      itemType: "sprite", subCategory: "player" },
  { id: "enemy",        name: "Enemy",       pathPrefix: "sprites/Enemy",       itemType: "sprite", subCategory: "monster" },
  { id: "npc",          name: "NPC",         pathPrefix: "sprites/NPC",         itemType: "sprite", subCategory: "npc" },
  { id: "effect",       name: "Effect",      pathPrefix: "sprites/Effect",      itemType: "sprite", subCategory: "effect" },
  { id: "item",         name: "Item",        pathPrefix: "sprites/Item",        itemType: "sprite", subCategory: "body" },
  { id: "interface",    name: "Interface",   pathPrefix: "sprites/Interface",   itemType: "sprite", subCategory: "interface" },
  { id: "map-anim",     name: "Map Anim",    pathPrefix: "sprites/Map/Animation", itemType: "sprite", subCategory: "map-anim" },
  { id: "ma",           name: "MA",          pathPrefix: "sprites/MA",          itemType: "sprite", subCategory: "ma" },
  { id: "ms",           name: "MS",          pathPrefix: "sprites/MS",          itemType: "sprite", subCategory: "ms" },
  { id: "sr",           name: "SR",          pathPrefix: "sprites/SR",          itemType: "sprite", subCategory: "sr" },
];

export function inferCategory(path: string): AssetCategory {
  for (const cat of CATEGORY_PATTERNS) {
    if (path.startsWith(cat.pathPrefix)) return cat;
  }
  return {
    id: "unknown",
    name: "Unknown",
    pathPrefix: "",
    itemType: "sprite",
    subCategory: "unknown",
  };
}

export function inferInventorySubCategory(id: string, path: string): AssetCategory["subCategory"] {
  const lower = `${id} ${path}`.toLowerCase();
  if (lower.includes("weapon") || lower.includes("_w_")) return "weapon";
  if (lower.includes("armor") || lower.includes("armour") || lower.includes("uarmor")) return "armor";
  if (lower.includes("hair") || lower.includes("_hair")) return "hair";
  if (lower.includes("face") || lower.includes("_face")) return "face";
  if (lower.includes("back") || lower.includes("cape") || lower.includes("accessory")) return "back";
  if (lower.includes("body") || lower.includes("_body")) return "body";
  if (lower.includes("head") || lower.includes("helmet") || lower.includes("hat")) return "head";
  if (lower.startsWith("sprites/effect")) return "effect";
  return "unknown";
}

export function getInventoryCategories(): { id: string; name: string }[] {
  return [
    { id: "weapon", name: "Weapon" },
    { id: "armor", name: "Armor" },
    { id: "head", name: "Head" },
    { id: "face", name: "Face" },
    { id: "hair", name: "Hair" },
    { id: "back", name: "Back" },
    { id: "effect", name: "Effect" },
    { id: "body", name: "Costume" },
    { id: "unknown", name: "Other" },
  ];
}
