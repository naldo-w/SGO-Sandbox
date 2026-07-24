# Architecture

## Layered Architecture

```
┌──────────────────────────────────────────────────────┐
│                     UI Layer                           │
│  React components, panels, controls, overlays         │
│  CharacterPanel, SlotPicker, Inventory, AssetBrowser  │
├──────────────────────────────────────────────────────┤
│                   Systems Layer                        │
│  EquipmentSystem — equip/validate/resolve             │
│  SaveSystem — localStorage persistence                │
├──────────────────────────────────────────────────────┤
│              Character & Render Layer                  │
│  PaperDoll (data-driven sprites), CharacterAnimator   │
│  PaperDollView (PixiJS compositing), Renderer         │
├──────────────────────────────────────────────────────┤
│              State Management (Zustand)                │
│  paperdollStore — character config, layers, presets   │
│  inventoryStore — all-items sandbox inventory          │
├──────────────────────────────────────────────────────┤
│                Data Definition Layer                   │
│  races/  — RaceDefinition (Migu, Human, Mech, Asian)  │
│  layers/ — LayerDefinition (zIndex, partSlots)        │
│  equipment/ — EquipmentDefinition (asset→layer map)   │
│  characters/ — CharacterDefinition (save format)      │
├──────────────────────────────────────────────────────┤
│               Asset Contract Layer                     │
│  TypeScript interfaces for all GameAssets schemas      │
│  AssetIndex, Animation, Frame, PartSlot, DirectionEntry│
├──────────────────────────────────────────────────────┤
│                   Data Layer                           │
│  asset.json index, sprite metadata, WebP textures     │
└──────────────────────────────────────────────────────┘
```

## Core Modules

### Data Definition Layer

All character-related definitions are data-driven, not hard-coded.

#### RaceDefinition (`src/data/races/`)

| Field | Description |
|-------|-------------|
| `id` | Unique race key |
| `name` | Display name |
| `bodyAsset` | Default body sprite asset path |
| `genders` | Available genders |
| `availableLayers` | Which layers this race can equip |
| `baseLayers` | Layers always present (e.g. body) |

**Supported races**: Migu, Human Male, Human Female, Mechanical Spirit, Asian

#### LayerDefinition (`src/data/layers/`)

| Field | Description |
|-------|-------------|
| `id` | Unique layer key |
| `name` | Display name |
| `zIndex` | Render priority (higher = on top) |
| `partSlots` | Which PartSlot(s) this layer maps to |
| `compatibleRaces` | Optional race restriction |

Layers are sorted by `zIndex` for rendering order.
When multiple layers map to the same PartSlot, the highest zIndex wins.

#### EquipmentDefinition (`src/data/equipment/`)

| Field | Description |
|-------|-------------|
| `id` | Unique equipment ID |
| `name` | Display name |
| `assetPath` | Path to sprite in GameAssets |
| `layerIds` | Which visual layers this item populates |
| `compatibleRaces` | Optional race restriction |

#### CharacterDefinition (`src/data/characters/`)

The saved character format containing race, gender, equipment map,
appearance settings, direction, animation state, and timestamps.

### Systems

#### EquipmentSystem (`src/systems/`)
- `resolveEquipActions(itemId, assetPath, layerIds, layers, race?)`
  Validates race compatibility, resolves layer → PartSlot mapping.
  Returns `EquipResult` with success/error and resolved actions.

#### Inventory (`src/inventory/`)
- Sandbox mode: all sprite assets available, no limits
- `buildInventory(assets)` — converts AssetEntry[] to InventoryItem[]
- `getLayerIdsForItem(item)` — infers which layers an item populates
- Search + category filter

#### CharacterSave (`src/save/`)
- `saveCharacter(data)` — localStorage persistence
- `loadCharacter(name, race)`, `loadAllCharacters()`
- `exportCharacterJSON()`, `importCharacterJSON()`
- `deleteCharacter()`

### PaperDoll
- Data-driven: creates sprites from LayerDefinition array
- No hard-coded LAYER_ORDER
- `setLayerDefs(defs)` — rebuilds sprite map from layer definitions
- Per-layer visibility/opacity, dynamic texture assignment

### CharacterAnimator
- Single animation clock shared across all layers
- Direction-aware frame resolution via `dir_ids`
- `getFrameFile(spritePath)` — returns frame file for current direction + frame
- Play/pause/speed/seek

### AssetLoader
- Reads `asset.json` master index
- Lazily loads animation, metadata, textures on demand
- Caches all loaded data
- Schema validation + error handling

## Directory Layout

```
src/
├── main.tsx                    # React entry
├── App.tsx                     # Root + PixiJS + tab system
│
├── assets/
│   ├── AssetLoader.ts          # asset.json → caches
│   ├── TextureCache.ts         # WebP texture cache
│   └── contract.ts             # All TypeScript interfaces
│
├── character/
│   ├── CharacterAnimator.ts    # Single-clock animation driver
│   ├── Character.ts            # Character container class
│   ├── CharacterPanel.tsx      # Main character composer UI
│   ├── PaperDoll.ts            # Data-driven layer compositor
│   ├── PaperDollView.tsx       # PixiJS React wrapper
│   ├── SlotPicker.tsx          # Per-layer item browser
│   ├── presets.ts              # Built-in character presets
│   ├── paperdollStore.ts       # Zustand character state
│   └── types.ts                # Character-specific types
│
├── data/
│   ├── races/
│   │   └── RaceDefinition.ts   # 5 races + getRaceById()
│   ├── layers/
│   │   ├── LayerDefinition.ts  # LayerDefinition interface
│   │   └── defaultLayers.ts    # 11 default layers + helpers
│   ├── equipment/
│   │   └── EquipmentDefinition.ts
│   └── characters/
│       └── CharacterDefinition.ts
│
├── systems/
│   └── EquipmentSystem.ts      # Equip validation + resolution
│
├── inventory/
│   ├── Inventory.ts            # Inventory builder + helpers
│   └── inventoryStore.ts       # Zustand inventory state
│
├── save/
│   └── CharacterSave.ts        # localStorage persistence
│
├── engine/
│   ├── Renderer.ts             # PixiJS Application wrapper
│   ├── DebugScene.ts           # Debug overlay
│   ├── Scene.ts                # Scene interface
│   └── Camera.ts               # Viewport controller
│
├── ui/
│   ├── AssetBrowser.tsx        # Asset list + search
│   ├── AssetPreview.tsx        # Single-asset PixiJS preview
│   ├── AssetSearch.tsx         # Category + search bar
│   └── PlayerControls.tsx      # Play/pause/speed/direction
│
├── stores/
│   └── sandboxStore.ts         # Generic UI state
│
└── effects/
    └── ...                     # Stub (future)
```

## Data Flow

```
RaceDefinition → available layers for this race
     │
     ▼
CharacterConfig (race + equipment map)
     │
     ▼
resolveLayers(equipment) → ResolvedLayer[] (PartSlot + AssetReference)
     │
     ▼
CharacterAnimator (single clock) → getFrameFile(spritePath)
     │
     ▼
PaperDoll (layer sprites, zIndex sorted) → setLayerTexture()
     │
     ▼
PixiJS render → Canvas
```

## Presets

6 built-in presets: Human Soldier, Elf Archer, Dwarf Berserker,
Migu Priestess, Mech Sentinel, Asian Wanderer.

Custom presets saved in-memory via Zustand store.

## Save System

- localStorage-based
- Key: `sgo-sandbox-characters`
- JSON array of CharacterDefinition
- Export as downloadable .json file
- Import via paste (future)

## Design Principles

1. **Data-driven** — all race, layer, equipment definitions are data, not code
2. **Single animation clock** — all character layers advance in lockstep
3. **Sandbox-first** — all items unlocked, no level/class restrictions
4. **No direct asset parsing** — consumes only pre-processed GameAssets
5. **No SGO-Reverse modifications** — SGO-Sandbox is a read-only consumer
