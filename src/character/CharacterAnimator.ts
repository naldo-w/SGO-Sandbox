import { assetLoader } from "../assets/AssetLoader";
import type { Animation, DirectionEntry } from "../assets/contract";
import type { DirectionCode, AnimationState } from "./types";

export class CharacterAnimator {
  private animationCache = new Map<string, Animation>();
  private _currentFrame = 0;
  private _playing = false;
  private _speed = 1;
  private _direction: DirectionCode = "S";
  private _state: AnimationState = "idle";
  private timer = 0;
  private fps = 8;

  get currentFrame(): number {
    return this._currentFrame;
  }

  get playing(): boolean {
    return this._playing;
  }

  get speed(): number {
    return this._speed;
  }

  get direction(): DirectionCode {
    return this._direction;
  }

  get state(): AnimationState {
    return this._state;
  }

  play(): void {
    this._playing = true;
  }

  pause(): void {
    this._playing = false;
  }

  toggle(): void {
    this._playing = !this._playing;
  }

  setSpeed(speed: number): void {
    this._speed = speed;
  }

  setDirection(dir: DirectionCode): void {
    this._direction = dir;
  }

  setState(state: AnimationState): void {
    this._state = state;
  }

  seek(frame: number): void {
    this._currentFrame = Math.max(0, frame);
  }

  reset(): void {
    this._currentFrame = 0;
    this.timer = 0;
  }

  async loadAnimationCache(spritePath: string): Promise<Animation | null> {
    if (this.animationCache.has(spritePath)) {
      return this.animationCache.get(spritePath)!;
    }
    try {
      const anim = await assetLoader.loadAnimation(spritePath);
      this.animationCache.set(spritePath, anim);
      return anim;
    } catch {
      return null;
    }
  }

  getAnimation(spritePath: string): Animation | null {
    return this.animationCache.get(spritePath) ?? null;
  }

  getDirEntry(spritePath: string): DirectionEntry | null {
    const anim = this.getAnimation(spritePath);
    if (!anim?.directions) return null;
    return anim.directions[this._direction] ?? null;
  }

  getDirIds(spritePath: string): number[] {
    const dirEntry = this.getDirEntry(spritePath);
    return dirEntry?.dir_ids ?? [];
  }

  getFrameFile(spritePath: string): string | null {
    const anim = this.getAnimation(spritePath);
    if (!anim) return null;

    const dirEntry = this.getDirEntry(spritePath);
    if (dirEntry) {
      const ids = dirEntry.dir_ids;
      if (ids.length === 0) return null;
      const idx = ids[this._currentFrame % ids.length];
      const frame = anim.frames[idx];
      return frame?.file ?? null;
    }

    if (anim.frames.length === 0) return null;
    const idx = this._currentFrame % anim.frames.length;
    return anim.frames[idx].file ?? null;
  }

  getMaxFrames(): number {
    let max = 0;
    for (const anim of this.animationCache.values()) {
      const dirEntry = anim.directions?.[this._direction];
      if (dirEntry) {
        max = Math.max(max, dirEntry.frame_count);
      } else {
        max = Math.max(max, anim.frames.length);
      }
    }
    return Math.max(max, 1);
  }

  update(dt: number): void {
    if (!this._playing) return;

    this.timer += dt;
    const frameDuration = 1 / (this.fps * this._speed);

    while (this.timer >= frameDuration) {
      this.timer -= frameDuration;
      this._currentFrame++;
      const maxFrames = this.getMaxFrames();
      if (maxFrames > 0 && this._currentFrame >= maxFrames) {
        this._currentFrame = 0;
      }
    }
  }

  clearCache(): void {
    this.animationCache.clear();
  }
}
