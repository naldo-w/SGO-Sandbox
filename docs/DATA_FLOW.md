# Data Flow

## Asset Loading Sequence

```
Page Load
   │
   ▼
GET asset.json  ───────────────────────────── 46,816 entries (cached in memory)
   │
   ├── Category scan → UI populates browse grid (thumbnails only)
   │
   └── On user selection:
           │
           ▼
       GET sprites/{Category}/{name}/animation.json
           │
           ├── Frame list → determine frame count, fps, anchor
           │
           └── For each frame:
                   │
                   ▼
               GET sprites/{Category}/{name}/frames/{idx}.webp
                   │
                   ▼
               PixiJS Texture.from() → decoded WebP → cached
```

## Animation Playback Flow

```
User clicks Play
       │
       ▼
AnimationController.play(direction: "NW")
       │
       ├── Look up direction in animation.json.directions
       │   (if ACT data present)
       │
       ├── Resolve frame index list from direction mapping
       │
       ├── Start ticker loop:
       │       every N ms (based on fps):
       │           advance frame index
       │           update texture + anchor on PixiJS sprite
       │
       └── On direction change:
               stop current loop
               resolve new frame list
               restart ticker
```

## Paper Doll Composition Flow

```
CharacterViewer selects: Class=A, ItemID=07, Action=NS1
       │
       ▼
PaperDoll.compose("A", "07", "NS1")
       │
       ├── Resolve part list from CharDrawOrder.dat rules:
       │       Back, Leg, R-Arm, Body, L-Arm, R-Shoulder, L-Shoulder, Bonnet
       │
       ├── For each part:
       │       resolve path: Player/A/{Part}{ItemID}_{ActionDir}.spr
       │       load texture frame for that part
       │       create PixiJS Sprite with anchor offset
       │       add to container in draw order
       │
       └── Return container → add to stage
```

## Map Render Flow

```
MapViewer selects map
       │
       ▼
MapRenderer.load(mapId)
       │
       ├── Stub until MAP/BLG conversion is complete in SGO-Reverse
       │
       ├── Planned:
       │       parse mapBlock.map → tile ID array
       │       parse Map.pic → tile atlas texture
       │       render tile grid as batched geometry
       │
       └── For now: render placeholder grid
```

## Screenshot Flow

```
User clicks Screenshot button
       │
       ▼
ScreenshotManager.capture()
       │
       ├── Hide UI overlay (CSS visibility toggle)
       │
       ├── PixiJS app.renderer.extract.canvas(pixiStage)
       │
       ├── canvas.toBlob("image/png")
       │
       ├── Create download link → trigger browser download
       │
       └── Restore UI overlay
```

## Data Dependencies

| Module | Depends On | Reads From |
|--------|-----------|------------|
| AssetLoader | — | `asset.json` |
| AnimationController | AssetLoader | `animation.json` (per sprite) |
| PaperDoll | AssetLoader | `CharDrawOrder.dat` (bundled), SPR frame metadata |
| CharacterRenderer | PaperDoll + AnimationController | Composed part textures |
| MapRenderer | AssetLoader (stub) | `mapBlock.map`, `Map.pic` (future) |
| ObjectLayer | MapRenderer | `ObjectList.dat` (future) |
| ScreenshotManager | PixiJS Application | Canvas pixel data |
