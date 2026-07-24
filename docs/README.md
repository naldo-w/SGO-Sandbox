# SGO-Sandbox

SGO Asset Interactive Playground — a browser-based interactive viewer for
星空之門／星夢 Online (2003–2012) assets, built on top of the SGO-Reverse
AssetPipeline output.

## Purpose

SGO-Reverse handles the heavy lifting: binary format reverse engineering,
SPR extraction, ACT parsing, and asset conversion. SGO-Sandbox consumes
the **output** — `GameAssets/` — and provides an interactive web playground
for inspecting, composing, and demonstrating the converted assets.

## What It Is Not

- Not a game engine
- Not a format parser
- Not a replacement for SGOMac (Swift/SpriteKit native port)

## Quick Start

```bash
# 1. Clone
git clone https://github.com/naldo-w/SGO-Sandbox.git
cd SGO-Sandbox

# 2. Symlink or copy GameAssets from SGO-Reverse
ln -s ../SGO-Reverse/GameAssets public/assets

# 3. Install & run
npm install
npm run dev
```

## Source of Truth

All data comes from `GameAssets/` produced by SGO-Reverse:

```
GameAssets/
├── asset.json           ← master asset index (46,816 entries)
├── sprites/             ← per-frame WebP + animation.json + metadata.json
│   ├── Enemy/
│   ├── NPC/
│   ├── Player/
│   ├── Effect/
│   ├── Interface/
│   ├── Map/
│   ├── MA/
│   ├── MS/
│   └── SR/
└── _atlas/              ← atlas build cache (not loaded at runtime)
```

## License

Planning phase — no license yet.
