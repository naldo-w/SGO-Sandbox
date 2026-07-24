# Product Requirements Document

## 1. Overview

SGO-Sandbox is an interactive web playground for inspecting and demonstrating
SGO game assets. It loads pre-processed assets from the SGO-Reverse pipeline
and renders them in the browser using PixiJS.

## 2. User Stories

### 2.1 Asset Browser
- User can browse all converted sprites by category (Enemy, NPC, Player, Effect, etc.)
- User can search sprites by name or ID
- User can view frame-by-frame animation with playback controls

### 2.2 Character Viewer
- User can compose a player character from individual parts (body, leg, arm, etc.)
- User can switch between race/class configurations
- User can cycle through action animations (stand, walk, attack, hit, death)

### 2.3 Monster Showcase
- User can browse all monster sprites
- User can view each monster's full animation set
- User can see monster metadata (name, size, frame count)

### 2.4 Map Viewer
- User can view rendered map tiles
- User can pan and zoom the camera
- User can toggle tile grid overlay

### 2.5 Effect / Skill Viewer
- User can browse skill and effect animations
- User can adjust playback speed
- User can layer effects on a dummy character

### 2.6 Screenshot Mode
- User can capture the current view as PNG
- User can toggle UI visibility for clean captures
- Optional: user can set a transparent background

## 3. Non-Goals

- Not a game: no gameplay, no combat, no Lua, no networking
- Not a level editor
- Not a format converter (all assets already converted by SGO-Reverse)
- Not mobile-optimized (desktop-first)

## 4. Constraints

- Browser only (no Electron, no native)
- Static file serving only (no backend, no database)
- All assets loaded client-side from GameAssets/ directory
- Must work with `npx serve` or similar zero-config static server
