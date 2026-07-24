import type { Animation, ActionState } from "../assets/contract";

export class AnimationController {
  private animation: Animation | null = null;
  private _currentFrame = 0;
  private _playing = false;
  private _speed = 1;
  private timer = 0;

  get currentFrame() {
    return this._currentFrame;
  }

  get playing() {
    return this._playing;
  }

  load(animation: Animation) {
    this.animation = animation;
    this._currentFrame = 0;
    this._playing = false;
  }

  play() {
    this._playing = true;
  }

  pause() {
    this._playing = false;
  }

  stop() {
    this._playing = false;
    this._currentFrame = 0;
  }

  seek(frame: number) {
    if (!this.animation) return;
    this._currentFrame = Math.max(0, Math.min(frame, this.animation.frames.length - 1));
  }

  update(dt: number) {
    if (!this._playing || !this.animation) return;
    const fps = this.animation.fps * this._speed;
    this.timer += dt;
    const frameDuration = 1 / fps;
    while (this.timer >= frameDuration) {
      this.timer -= frameDuration;
      this._currentFrame++;
      if (this._currentFrame >= this.animation.frames.length) {
        this._currentFrame = 0;
      }
    }
  }

  setSpeed(speed: number) {
    this._speed = speed;
  }

  destroy() {
    this.animation = null;
  }
}
