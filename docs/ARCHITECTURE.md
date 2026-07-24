# Architecture

## Layered Architecture

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer                          │
│  React components, pages, controls, overlays        │
├─────────────────────────────────────────────────────┤
│                  Application Layer                   │
│  AssetStore, AnimationController, ScreenshotManager │
├─────────────────────────────────────────────────────┤
│                   Render Layer                       │
│  PixiJS Application, Stage, Containers, Filters     │
├─────────────────────────────────────────────────────┤
│                   Asset Layer                        │
│  AssetLoader, TextureCache, animation.json parser   │
├─────────────────────────────────────────────────────┤
│               Asset Contract Layer                   │
│  TypeScript interfaces for all GameAssets schemas    │
│  Direction mapping, character entity, map format     │
├─────────────────────────────────────────────────────┤
│                   Data Layer                         │
│  asset.json index, sprite metadata, WebP textures   │
└─────────────────────────────────────────────────────┘
```

## Core Modules

### Asset Contract Layer

The Asset Contract Layer defines the TypeScript interfaces for all data
exchanged between SGO-Reverse and SGO-Sandbox. It is a **compile-time only**
layer — no runtime code, no validation logic, strictly type definitions.

Full contract specification in `docs/ASSET_CONTRACT.md`.

#### Contracts Defined

| Contract | File | Purpose |
|----------|------|---------|
| AssetIndex | `asset.json` | Top-level asset registry |
| Animation | `animation.json` | Frame/direction metadata |
| SpriteMetadata | `metadata.json` | Conversion provenance |
| CharacterEntity | (in-memory) | Paper doll composition |
| AnimationStateMachine | (in-memory) | Action state transitions |
| MapResource | `maps/*.json` (future) | Tile grid + objects |
| EffectResource | `sprites/Effect/*/animation.json` | Skill/effect data |

#### Contract Rules

1. SGO-Sandbox reads **only** files listed in the contract
2. No raw SPR/ACT/GTX/DAT parsing is permitted
3. All asset paths are relative to `GameAssets/` root
4. Type definitions live in `src/assets/types.ts`

### AssetLoader
- Reads `asset.json` master index
- Lazily loads WebP textures on demand
- Caches decoded textures in a Map<id, Texture>
- Provides progress events for bulk loading

### AnimationController
- Parses `animation.json` per sprite
- Manages frame timing (fps, loop, direction)
- Provides play/pause/seek interface
- Supports direction switching (stand/walk/attack)

### PaperDoll
- Composes layered character from part references
- Handles draw order (Back → Leg → Body → Arm → Head → Accessory)
- Each layer is an independent SKSpriteNode-style container
- Supports per-layer anchor offset

### CharacterRenderer
- Wraps PaperDoll + AnimationController
- Manages action state machine (idle → walk → attack → hit → dead)
- Coordinates multi-layer animation sync

### MapRenderer
- Renders tile grid from tile data (not yet converted — stub)
- Handles isometric or orthographic projection
- Manages camera pan/zoom

### ObjectLayer
- Renders map objects (buildings, decorations)
- Manages z-order sorting by y-position

### Camera
- Viewport controller for pan/zoom/rotate
- Clamp to world bounds
- Supports follow-target mode (for animated subjects)

## Data Flow

```
User interaction
       │
       ▼
React state update
       │
       ▼
Application module (AssetStore, AnimationController)
       │
       ▼
PixiJS render update (ticker-driven)
       │
       ▼
Canvas output
```

## Directory Layout (src/)

```
src/
├── main.tsx                 # React entry point
├── App.tsx                  # Root component + PixiJS container
├── assets/
│   ├── AssetLoader.ts       # asset.json → texture cache
│   ├── TextureCache.ts      # Map<id, WebP Texture>
│   └── contract.ts          # Asset Contract (all TypeScript interfaces)
│   └── types.ts             # asset.json type definitions (legacy, prefer contract.ts)
├── animation/
│   ├── AnimationController.ts
│   ├── types.ts             # animation.json type definitions
│   └── frameUtils.ts        # anchor calculation, rect mapping
├── renderer/
│   ├── PixiApp.ts           # PixiJS Application singleton
│   ├── CharacterRenderer.ts # PaperDoll + Animation integration
│   ├── MapRenderer.ts       # Tile grid + object layer
│   └── Camera.ts            # Pan/zoom/rotate controller
├── paperdoll/
│   ├── PaperDoll.ts         # Multi-layer character compositor
│   └── partDefinitions.ts   # Layer order + slot mapping
├── components/
│   ├── AssetBrowser.tsx     # Category grid + search
│   ├── CharacterViewer.tsx  # Paper doll controls
│   ├── MonsterShowcase.tsx  # Monster gallery
│   ├── MapViewer.tsx        # Map render container
│   ├── EffectViewer.tsx     # Skill/effect player
│   ├── PlayerControls.tsx   # Play/pause/speed/direction
│   └── Toolbar.tsx          # Global controls + screenshot
├── screenshot/
│   └── ScreenshotManager.ts # Canvas → PNG export
└── utils/
    ├── paths.ts             # GameAssets path resolution
    └── types.ts             # Shared type definitions
```
