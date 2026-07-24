# Asset Contract — SGO-Reverse → SGO-Sandbox

## Purpose

Define the data interface between SGO-Reverse (asset pipeline producer)
and SGO-Sandbox (interactive browser consumer). SGO-Sandbox must only
consume assets in the formats described below. No raw SPR/ACT/GTX/DAT
parsing is allowed.

## 1. GameAssets Directory Contract

```
GameAssets/                        ← project root or symlink target
├── asset.json                     ← master asset index (required)
├── sprites/                       ← sprite asset tree
│   ├── Enemy/                     ← category root
│   │   ├── EN050B/                ← sprite directory (name = SPR prefix)
│   │   │   ├── frames/            ← per-frame WebP textures
│   │   │   │   ├── 000.webp
│   │   │   │   ├── 001.webp
│   │   │   │   └── ...
│   │   │   ├── animation.json     ← frame + direction metadata
│   │   │   └── metadata.json      ← conversion provenance
│   │   ├── EN013A3/
│   │   └── ...
│   ├── NPC/
│   ├── Player/
│   ├── Effect/
│   ├── Interface/
│   ├── Map/Animation/
│   ├── MA/
│   ├── MS/
│   └── SR/
└── _atlas/                        ← atlas cache (NOT loaded at runtime)
```

### Directory Rules

| Element | Rule |
|---------|------|
| `sprites/{Category}/{name}/` | Each sprite occupies its own directory |
| `frames/` | Flat directory of sequentially numbered WebP files |
| `animation.json` | Required for animated sprites; singleton per sprite |
| `metadata.json` | Optional; present if conversion metadata exists |
| `asset.json` | Single file at root; master index of all assets |

### Path Resolution

```
asset.json path format: sprites/{Category}/{name}
→ resolved as: GameAssets/sprites/{Category}/{name}/

frame path: sprites/{Category}/{name}/frames/{idx}.webp
→ resolved as: GameAssets/sprites/{Category}/{name}/frames/{idx}.webp
```

## 2. asset.json Schema

**File**: `GameAssets/asset.json`

```typescript
interface AssetIndex {
  generated: string;              // ISO 8601 timestamp
  assets: AssetEntry[];
}

interface AssetEntry {
  id: string;                     // unique identifier (path-safe)
  type: "sprite" | "texture" | "map" | "item" | "palette";
  path: string;                   // relative to GameAssets/ (e.g. "sprites/Enemy/EN050B")
  texture?: string;               // path to texture directory (e.g. "sprites/Enemy/EN050B/frames")
  animation?: string;             // path to animation.json (e.g. "sprites/Enemy/EN050B/animation.json")
  metadata?: string;              // path to metadata.json
  dependencies?: string[];        // dependent asset IDs
}
```

### Loading Strategy

1. Fetch `asset.json` on app startup
2. Build an in-memory Map<id, AssetEntry> for O(1) lookup
3. Filter entries by `type === "sprite"` for asset browser
4. Load sprite data on demand (not preload)

## 3. animation.json Schema

**File**: `GameAssets/sprites/{Category}/{name}/animation.json`

```typescript
interface Animation {
  name: string;                   // sprite name (matches directory name)
  frames: Frame[];
  fps: number;                    // default frames per second
  direction?: string;             // direction label (legacy, prefer directions block)
  action?: string;                // action label (legacy, prefer directions block)
  directions?: Record<string, DirectionEntry>;  // ACT-derived (optional)
}

interface Frame {
  file: string;                   // relative path e.g. "frames/000.webp"
  index: number;                  // frame index in original SPR
  width: number;                  // frame pixel width
  height: number;                 // frame pixel height
  anchor: [number, number];       // anchor offset [x, y] in pixels
}

interface DirectionEntry {
  dir_ids: number[];              // direction variant indices
  frame_count: number;            // frames in this direction
  fps: number;                    // direction-specific fps
  action?: string;                // human-readable action name
  sound?: string;                 // SE code e.g. "SE0163"
}
```

### Contract Notes

- Without ACT data: `directions` block is absent; playback uses all frames in order
- With ACT data: `directions` block codes map to SPR filename suffixes
- `anchor` origin is top-left (must be converted for PixiJS bottom-left origin)
- `file` paths are relative to the sprite directory

### Direction Code → SPR Suffix Mapping

| Direction Code | Meaning | SPR Suffix | Found In |
|---------------|---------|-----------|----------|
| NS / S | Normal Stand | `_NS*` | Enemy, MA, SR |
| NW / W | Normal Walk | `_NW*` | Enemy |
| ND / D | Normal Death | `_ND*` | Enemy, SR |
| FA / A | Fight Attack | `_FA*` | Enemy, SR |
| NH / H | Normal Hit | `_NH*` | Enemy |
| NR | Normal Run | `_NR*` | MA, SR |
| NU | Normal Unknown | `_NU*` | SR |
| NC | Normal Unknown | `_NC*` | SR |
| EA | Event Attack | `_EA*` | SR |
| FS | Fight Skill | `_FS*` | SR |
| NA | Normal Unknown | `_NA*` | MA |
| AA | Attack A | `_AA*` | Effect, MS |
| AB | Attack B | `_AB*` | Effect |
| GA | Guard A | `_GA*` | Effect, MS |
| GB | Guard B | `_GB*` | Effect |

Full mapping in `AssetPipeline/schemas/direction_mapping.json`.

## 4. metadata.json Schema

**File**: `GameAssets/sprites/{Category}/{name}/metadata.json`

```typescript
interface SpriteMetadata {
  source: string;                 // absolute path to original SPR
  original_file: string;          // path relative to assets/webp/
  frames_total: number;           // total frame count
  atlas_w?: number;               // source atlas width (if from atlas)
  atlas_h?: number;               // source atlas height (if from atlas)
}
```

### Usage in Sandbox

- Display frame count in sprite info panel
- Track conversion provenance (optional, for debugging)
- Not required for rendering; animation.json is the primary data source

## 5. Character Entity Format

A character in the Sandbox is an in-memory composition, not a serialized file:

```typescript
interface CharacterEntity {
  id: string;                     // e.g. "Player/A/07"
  className: string;              // "A" | "B" | "G" | "R" | "Y"
  itemId: string;                 // e.g. "07"
  parts: CharacterPart[];         // composed parts (resolved at load time)
  action: ActionState;            // current animation action
  direction: string;              // current direction code
}

interface CharacterPart {
  slot: PartSlot;                 // body part identifier
  spriteId: string;               // asset.json id for this part
  animation: Animation;           // loaded animation.json
  anchor: [number, number];       // anchor in pixels (from SPR frame)
}
```

### Resolution Rules

1. Class letter (A/B/G/R/Y) determines which Player subdirectory to use
2. Item ID (07) selects the part variant within that class
3. Action + Direction suffix (NS1, NW2, FA3) selects the SPR variant
4. Draw order from `CharDrawOrder.dat` defines layer stacking

## 6. Paper Doll Layer System

### Layer Order (back to front)

```
Index  Slot           Example (Class A)
─────────────────────────────────────────
0      Back           A-Back07_NS1.spr
1      Leg            A-Leg07_NS1.spr
2      R-Arm          A-R-Arm07_NS1.spr
3      Body           A-Body07_NS1.spr
4      L-Arm          A-L-Arm07_NS1.spr
5      R-Shoulder     A-R-Shoulder07_NS1.spr
6      L-Shoulder     A-L-Shoulder07_NS1.spr
7      Bonnet         A-Bonnet07_NS1.spr
```

### Layer Rules

- Each layer is an independent PixiJS `Sprite` (or `Container` for multi-frame)
- Layers are parented to a shared `Container` at character position
- Each layer has its own `anchorPoint` calculated from the frame anchor
- All layers animate in sync (same frame index advances together)
- Draw order is fixed; z-index = layer index

### Part Resolution

```
Part path template:
  Player/{Class}/{PartName}{ItemID}_{ActionDir}.spr

Example:
  Player/A/Leg07_NS1.spr
       ↑   ↑   ↑    ↑
     Class Part ID  Action+Direction
```

## 7. Animation State Format

```typescript
type ActionState =
  | "idle"          // NS — Normal Stand (default, looping)
  | "walk"          // NW — Normal Walk (looping)
  | "attack"        // FA — Fight Attack (play once, return to idle)
  | "hit"           // NH — Normal Hit (play once, return to idle)
  | "death"         // ND — Normal Death (play once, freeze on last frame)
  | "skill"         // FS — Fight Skill (play once, return to idle)
  | "run";          // NR — Normal Run (looping)

interface AnimationStateMachine {
  current: ActionState;
  previous: ActionState;
  transitions: Record<ActionState, ActionState[]>;
  // idle ↔ walk, idle → attack → idle, idle → hit → idle,
  // idle → death (terminal), idle → skill → idle
}
```

### State Transition Rules

```
        ┌───────┐
        │ idle  │◄──────────────┐
        └───┬───┘               │
       ┌────┼────┐              │
       ▼    ▼    ▼              │
     walk attack hit            │
       │    │    │              │
       └────┴────┴──► idle ─────┘
                      (automatic return)

        idle ──► death (terminal, no return)
        idle ──► skill ──► idle
```

### Frame Selection Per State

Each state maps to a direction code from `animation.json.directions`:

```typescript
const stateToDirection: Record<ActionState, string> = {
  idle:   "NS",
  walk:   "NW",
  attack: "FA",
  hit:    "NH",
  death:  "ND",
  skill:  "FS",
  run:    "NR",
};
```

## 8. Map Resource Format

**Status**: Stub until MAP/BLG/GTX parsers are complete in SGO-Reverse.

```typescript
interface MapResource {
  id: string;                     // e.g. "Map45"
  width: number;                  // tile columns
  height: number;                 // tile rows
  tileSize: number;               // pixels per tile (32)
  tiles: number[][];              // tile ID grid [row][col]
  tileAtlas: string;              // path to tile atlas texture
  objects: MapObject[];           // placed objects
  blocking: boolean[][];          // collision grid (2x resolution)
}

interface MapObject {
  id: number;                     // object ID
  sprFile: string;                // SPR file name
  x: number;                      // tile x position
  y: number;                      // tile y position
  z: number;                      // vertical layer
  scale: number;                  // 1.0 = original size
}
```

### Loading Contract

- When available: MapResource is loaded as a single JSON file from `GameAssets/maps/`
- Tile atlas texture loaded as WebP
- Collision data loaded separately as `Blocking.dat` (parsed by SGO-Reverse first)
- Until implemented: Map viewer shows placeholder grid

## 9. Effect Resource Format

```typescript
interface EffectResource {
  id: string;                     // e.g. "Hit_Effect51"
  type: "skill" | "hit" | "buff" | "weapon";
  animation: Animation;           // animation.json (standard format)
  attachPoint?: string;           // "body" | "weapon" | "ground"
  loop: boolean;                  // whether effect loops
  blendMode?: string;             // PixiJS blend mode (default: normal)
}
```

### Effect Categories

| Category | Files | ACT Coverage | Behavior |
|----------|-------|-------------|----------|
| Hit_Effect | ~20 | ✅ Full | Plays on hit; attach to target |
| Normal_Effect | ~10 | ✅ Full | Ambient/spawn effects |
| Skill_Effect | ~24 | ✅ Partial | Plays during skill cast |
| Weapon_Effect | ~30 | ✅ Full | Attach to weapon sprite |
| D3_* | 48 | ❌ Orphan | 3D renderer variant (stub) |
| B_Skill_Use8_* | 11 | No ACT | Standard animation only |

### Rendering Rules

- Effects without ACT data: play all frames in sequence at default fps
- Effects with ACT data: respect direction/timing/sound from directions block
- Hit/weapon effects: parented to character (follows movement)
- Ground effects: placed at world coordinates, not character-relative
- Blend mode: `normal` for most effects; `add` for glow/light effects
