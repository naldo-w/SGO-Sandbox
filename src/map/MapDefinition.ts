export interface MapObject {
  id: number;
  sprFile: string;
  x: number;
  y: number;
  z: number;
  scale: number;
}

export interface SpawnPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface BackgroundLayer {
  index: number;
  image: string;
  scrollFactor: number;
}

export interface MapDefinition {
  mapId: string;
  name: string;
  width: number;
  height: number;
  tileSize: number;
  tiles: number[][];
  tileAtlas: string;
  objects: MapObject[];
  spawnPoints: SpawnPoint[];
  blocking: boolean[][];
  backgroundLayers: BackgroundLayer[];
  music?: string;
  ambient?: string;
}

export const MAP_STUBS: Record<string, Partial<MapDefinition>> = {
  "ninia-castle": {
    mapId: "ninia-castle",
    name: "Ninia Castle",
    tileSize: 32,
    objects: [],
    spawnPoints: [
      { id: "entrance", x: 10, y: 5, label: "Castle Entrance" },
      { id: "throne", x: 20, y: 15, label: "Throne Room" },
    ],
    backgroundLayers: [],
  },
  "hunting-01": {
    mapId: "hunting-01",
    name: "Nearby Hunting Map",
    tileSize: 32,
    objects: [],
    spawnPoints: [
      { id: "enter", x: 0, y: 0, label: "Entrance" },
    ],
    backgroundLayers: [],
  },
};

export function getMapStub(mapId: string): MapDefinition | null {
  const stub = MAP_STUBS[mapId];
  if (!stub) return null;
  return {
    mapId: stub.mapId ?? mapId,
    name: stub.name ?? "Unknown Map",
    width: stub.width ?? 50,
    height: stub.height ?? 50,
    tileSize: stub.tileSize ?? 32,
    tiles: stub.tiles ?? [],
    tileAtlas: stub.tileAtlas ?? "",
    objects: stub.objects ?? [],
    spawnPoints: stub.spawnPoints ?? [],
    blocking: stub.blocking ?? [],
    backgroundLayers: stub.backgroundLayers ?? [],
    music: stub.music,
    ambient: stub.ambient,
  };
}
