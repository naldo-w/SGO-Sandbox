# Asset Loading Guide

## Overview

SGO-Sandbox loads GameAssets produced by SGO-Reverse at runtime.
Assets are **not bundled** into the web build — they are served
as static files alongside the application.

## Development Setup

### Symlink (Recommended)

```bash
# From SGO-Sandbox root
ln -s ../../SGO-Reverse/GameAssets public/GameAssets
```

This creates a symlink from `public/GameAssets/` to the real
GameAssets output directory in the SGO-Reverse project.

Vite serves files from `public/` as static assets, so
`/GameAssets/asset.json` is available at dev time.

### Manual Copy (Alternative)

```bash
cp -r ../SGO-Reverse/GameAssets public/GameAssets
```

Only needed if symlinks are not supported (e.g., Windows without
developer mode).

## Production Deployment

GameAssets must be hosted as static files accessible from the
browser. Options:

### Same Origin (Recommended)

Place GameAssets directory on the same web server:

```
/var/www/sgo-sandbox/
├── index.html
├── assets/
├── GameAssets/          ← copy or mount here
│   ├── asset.json
│   └── sprites/
└── ...
```

### CDN / Object Storage

Upload GameAssets to a CDN and set the environment variable:

```env
VITE_GAME_ASSET_PATH=https://cdn.example.com/GameAssets
```

The application fetches `{VITE_GAME_ASSET_PATH}/asset.json`
at startup and resolves all sprite paths relative to it.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_GAME_ASSET_PATH` | `/GameAssets` | Base URL for GameAssets directory |

Set in `.env` file or as a build-time environment variable.

## Asset Size Reference

| Directory | Size | Files |
|-----------|------|-------|
| `sprites/` | ~1.2 GB | 173,920 WebP frames |
| `_atlas/` | ~639 MB | Atlas cache (not loaded at runtime) |
| `asset.json` | ~4 MB | 46,816 asset entries |

## Runtime Loading Sequence

```
1. App starts → fetch {VITE_GAME_ASSET_PATH}/asset.json
2. Parse & validate schema → populate in-memory index
3. UI shows category counts + asset list
4. On user selection:
   a. Fetch metadata.json (optional)
   b. Fetch animation.json (if animated)
   c. Load first frame WebP texture
   d. Subsequent frames loaded on demand during playback
```

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `HTTP 404` on asset.json | Symlink missing or wrong path | `ls -la public/GameAssets/asset.json` |
| `Schema mismatch` error | Stale asset.json from different pipeline version | Re-run SGO-Reverse pipeline |
| WebP loading fails | Browser doesn't support WebP | Use Chrome/Firefox (Safari 16+ also works) |
| Slow first load | 1.2 GB of assets to scan | Asset index is loaded once; sprites are lazy-loaded |
