# SGO-Sandbox

SGO Asset Interactive Playground — a browser-based sandbox for
星空之門／星夢 Online (2003–2012) assets.

## Overview

SGO-Sandbox is a standalone web application that consumes pre-processed
assets from the [SGO-Reverse](https://github.com/naldo-w/SGO-Reverse)
pipeline. It provides an interactive playground for character composition,
animation preview, map viewing, and effect showcase — all in the browser.

## Quick Start

```bash
# Clone
git clone https://github.com/naldo-w/SGO-Sandbox.git
cd SGO-Sandbox

# Symlink GameAssets from SGO-Reverse
ln -s ../SGO-Reverse/GameAssets public/GameAssets

# Install & run
npm install
npm run dev
```

## Documentation

- [PRD](./docs/PRD.md) — Product requirements
- [Architecture](./docs/ARCHITECTURE.md) — System architecture
- [Asset Contract](./docs/ASSET_CONTRACT.md) — Data interface specification
- [Data Flow](./docs/DATA_FLOW.md) — Loading and rendering flow
- [Roadmap](./docs/ROADMAP.md) — Development phases
- [Milestones](./docs/MILESTONES.md) — Milestone acceptance criteria

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| TypeScript | Language |
| React 18 | UI layer |
| Vite 6 | Build tool |
| PixiJS 8 | 2D WebGL rendering |
| Zustand | State management |

## Relationship to SGO-Reverse

| Aspect | SGO-Reverse | SGO-Sandbox |
|--------|-------------|-------------|
| Role | Asset pipeline & RE | Interactive playground |
| Parses | SPR, ACT, GTX, MAP | Nothing (consumes GameAssets only) |
| Output | GameAssets/ | Web app |
| Platform | Python (CLI) | Browser (TypeScript) |

## License

MIT
