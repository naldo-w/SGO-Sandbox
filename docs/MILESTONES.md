# Milestones

## M0 — Scaffold (Week 1)

**Goal**: Project skeleton with working PixiJS canvas.

```typescript
// Acceptance criteria:
- npm run dev starts Vite dev server
- PixiJS canvas visible in browser
- asset.json loads successfully
- No runtime errors in console
```

**Deliverables**:
- `src/renderer/PixiApp.ts` — Application singleton
- `src/assets/AssetLoader.ts` — asset.json fetch + parse
- `src/App.tsx` — root component with canvas container
- `src/components/Toolbar.tsx` — placeholder toolbar

**Verification**:
- ✅ Vite dev server starts on port 3000
- ✅ PixiJS canvas renders with debug overlay
- ✅ AssetLoader validates schema + handles errors
- ✅ DebugScene shows FPS counter + render info
- ✅ vitest test suite for AssetLoader passes

---

## M1 — Asset Browser (Week 2)

**Goal**: Browse and preview any sprite in the GameAssets index.

```typescript
// Acceptance criteria:
- Category tabs (Enemy, NPC, Player, etc.)
- Sprite grid with thumbnail per sprite
- Click sprite → opens preview panel
- Play/pause/seek controls work
- FPS indicator
```

**Deliverables**:
- `src/ui/AssetBrowser.tsx` — Asset list with category filter
- `src/ui/AssetSearch.tsx` — Search + category filter bar
- `src/ui/AssetPreview.tsx` — PixiJS preview panel with frame/direction info
- `src/assets/AssetLoader.ts` — Full validation + error handling + search
- `.env` — VITE_GAME_ASSET_PATH configuration
- `docs/ASSET_LOADING.md` — Asset loading guide for dev & production
- `tests/asset-loader.test.ts` — 7 test cases (load, HTTP error, JSON error, schema, network, lookup, search)

---

## M2 — Character Composer (Weeks 3–4)

**Goal**: Full paper doll character with multi-layer animation.

```typescript
// Acceptance criteria:
- 8-part character composition (Back → Bonnet)
- Part textures load and align correctly
- All action directions playable (NS, NW, FA, ND, NH)
- Action switching works mid-animation
- Race/class selection changes appearance
```

**Deliverables**:
- `src/paperdoll/PaperDoll.ts`
- `src/renderer/CharacterRenderer.ts`
- `src/components/CharacterViewer.tsx`

**M2 is the core differentiator** — no other SGO tool has a working
multi-layer paper doll in the browser. This milestone validates the
entire asset pipeline + animation system end-to-end.

---

## M3 — Monster & Effect Showcase (Week 5)

**Goal**: Browse monsters, skills, and effects with full animation.

```typescript
// Acceptance criteria:
- Monster gallery with 1,638 entries
- Each monster shows all available directions
- Effect browser with 164 effects
- Effects can be layered on a dummy character
- Search by name or ID
```

**Deliverables**:
- `src/components/MonsterShowcase.tsx`
- `src/components/EffectViewer.tsx`

---

## M4 — Map Viewer (Weeks 6–7)

**Goal**: View rendered game maps with interactive camera.

```typescript
// Acceptance criteria:
- Map tile grid rendered
- Camera pan with mouse drag
- Camera zoom with scroll wheel
- Grid overlay toggle
- Object layer rendered on top of tiles
```

**Deliverables**:
- `src/renderer/MapRenderer.ts`
- `src/renderer/Camera.ts`
- `src/components/MapViewer.tsx`

**Known dependency**: MapRenderer requires MAP/BLG/GTX parsers
from SGO-Reverse to produce tile data. If those are incomplete,
M4 uses a placeholder grid.

---

## M5 — Polish & Deploy (Week 8)

**Goal**: Production-ready with screenshot mode and deployment.

```typescript
// Acceptance criteria:
- Screenshot captures current view as PNG
- UI toggle for clean captures
- Dark/light theme
- Static build works with any HTTP server
- README with setup and usage guide
- Performance: 60fps for single character
```

**Deliverables**:
- `src/screenshot/ScreenshotManager.ts`
- Build config (`vite.config.ts`)
- Deployment guide

---

## MVP Scope

The Minimum Viable Product is **M0 + M1 + M2**:

| Feature | MVP | Post-MVP |
|---------|-----|----------|
| Asset browser | ✅ | Search, filtering |
| Single sprite playback | ✅ | Direction switching |
| Paper doll (8 layers) | ✅ | All 5 races |
| Action state machine | ✅ | Full animation set |
| Monster showcase | — | M3 |
| Effect viewer | — | M3 |
| Map viewer | — | M4 |
| Screenshot | — | M5 |

**MVP acceptance**: User can browse, compose, and animate a multi-layer
player character in the browser. This proves the end-to-end integration
of SGO-Reverse output + PixiJS rendering.
