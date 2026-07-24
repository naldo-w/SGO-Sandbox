# Roadmap

## Phase 0 — Foundation (Week 1)

| Task | Output |
|------|--------|
| Initialize Vite + React + TypeScript | `npm create vite` scaffold |
| Configure PixiJS + Zustand | `package.json` dependencies |
| Create AssetLoader with asset.json parsing | `src/assets/AssetLoader.ts` |
| Create PixiJS Application wrapper | `src/renderer/PixiApp.ts` |
| Create basic App shell with Toolbar | `src/App.tsx`, `Toolbar.tsx` |
| Set up public/assets symlink | Local dev environment |

**Acceptance**: App loads, PixiJS canvas renders, asset.json is fetched.

## Phase 1 — Asset Browser (Week 2)

| Task | Output |
|------|--------|
| Category grid component | `AssetBrowser.tsx` |
| Sprite search/filter | AssetBrowser search bar |
| Single-sprite preview with playback | `AnimationController.ts` + `PlayerControls.tsx` |
| Frame-by-frame seek | AnimationController.seek() |

**Acceptance**: User can browse 46K sprites by category, play animation.

## Phase 2 — Character Viewer (Weeks 3–4)

| Task | Output |
|------|--------|
| PaperDoll compositor | `paperdoll/PaperDoll.ts` |
| Part definition loader | `paperdoll/partDefinitions.ts` |
| CharacterRenderer integration | `renderer/CharacterRenderer.ts` |
| Multi-layer animation sync | AnimationController multi-layer mode |
| Action state machine | idle → walk → attack → hit → death |
| Race/class selector UI | CharacterViewer controls |

**Acceptance**: User can compose a 8-layer character, play all actions.

## Phase 3 — Monster & Effect Showcase (Week 5)

| Task | Output |
|------|--------|
| Monster thumbnail gallery | `MonsterShowcase.tsx` |
| Full animation grid per monster | Monster detail view |
| Effect browser | `EffectViewer.tsx` |
| Skill effect on dummy character | Effect layering |

**Acceptance**: User can browse 1,638 monsters + 164 effects.

## Phase 4 — Map Viewer (Weeks 6–7)

| Task | Output |
|------|--------|
| MapRenderer | Tile grid placement |
| Camera pan/zoom | `renderer/Camera.ts` |
| Grid overlay toggle | MapViewer controls |
| Object layer rendering | `ObjectLayer` (depends on SGO-Reverse MAP/BLG parser) |

**Acceptance**: User can view a map, pan/zoom, see tile grid.

## Phase 5 — Polish (Week 8)

| Task | Output |
|------|--------|
| Screenshot mode | `ScreenshotManager.ts` |
| UI theme refinement | Styling pass |
| Performance optimization | Texture preload, lazy loading |
| README + deployment guide | Documentation |

**Acceptance**: All features functional, documented, deployable.
