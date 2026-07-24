# Milestones

## M0 — Scaffold

**Goal**: Project skeleton with working PixiJS canvas.

**Verification**:
- ✅ Vite dev server starts on port 3000
- ✅ PixiJS canvas renders with debug overlay
- ✅ AssetLoader validates schema + handles errors
- ✅ DebugScene shows FPS counter + render info
- ✅ vitest test suite for AssetLoader passes

---

## M1 — Asset Browser

**Goal**: Browse and preview any sprite in the GameAssets index.

**Deliverables**:
- Asset list with category filter
- PixiJS preview panel with animation playback
- Play/pause/seek/speed/direction controls
- Search + category filter bar
- Asset loading guide

---

## M2 — Character Composer (Data-Driven Architecture)

### M2.1 — Foundation

- `CharacterConfig` data model
- `PaperDoll` per-layer compositor
- Basic layer rendering with hardcoded slots

### M2.2 — Runtime Refinement

- `CharacterAnimator` — single clock, direction-aware frame mapping
- Per-layer visibility + opacity controls
- Character presets (6 built-in)
- SlotPicker with thumbnail previews

### M2.3 — Architecture Refactor (Current)

**Refactored from hardcoded slots to data-driven architecture:**

| Before | After |
|--------|-------|
| 6 hardcoded equip slots | 11 data-driven `LayerDefinition`s |
| `EQUIP_TO_RENDER` static map | `defaultLayers.ts` with zIndex + partSlots |
| Fixed presets | `presets.ts` + custom preset save/load |
| No inventory | `Inventory.ts` + `inventoryStore.ts` (all-items sandbox) |
| No save system | `CharacterSave.ts` (localStorage + export) |
| No race system | `RaceDefinition` (5 races: Migu, Human M/F, Mech, Asian) |
| No validation | `EquipmentSystem.ts` (race/layer compatibility) |

**New data layer**: `src/data/races/`, `src/data/layers/`, `src/data/equipment/`, `src/data/characters/`

**Updated docs**: `docs/ARCHITECTURE.md` fully rewritten

**Target for M3**: Character Studio — full SGO character creation flow,
complete equipment backpack, photo mode basics

---

## M3 — Character Studio

**Goal**: Full SGO character creation with race selection, equipment backpack, save/load.

```typescript
// Acceptance criteria:
- Migu / Human Male / Human Female / Mech Spirit / Asian
- Full equipment backpack (search, filter, equip)
- Character save/load (localStorage + export)
- Photo Mode basics
```

---

## M4 — Monster & Effect Showcase

**Goal**: Browse monsters, skills, and effects with full animation.

---

## M5 — Map Viewer

**Goal**: View rendered game maps with interactive camera.

---

## M6 — Polish & Deploy

**Goal**: Production-ready with screenshot mode and deployment.

---

## MVP Scope

The Minimum Viable Product is **M0 + M1 + M2**:

| Feature | MVP | Post-MVP |
|---------|-----|----------|
| Asset browser | ✅ | Search, filtering |
| Single sprite playback | ✅ | Direction switching |
| Paper doll (data-driven) | ✅ | All 5 races |
| Animation sync | ✅ | Full animation set |
| Equipment backpack | ✅ | — |
| Character save/export | ✅ | Cloud sync |
| Monster showcase | — | M4 |
| Effect viewer | — | M4 |
| Map viewer | — | M5 |
| Photo Mode | — | M3 |

**MVP acceptance**: User can browse, compose, save, and animate a multi-layer
player character in the browser. All race/layer/equipment data is definition-driven.
