import { Container, Sprite, Texture } from "pixi.js";
import type { EffectResource } from "../assets/contract";

export class EffectPlayer {
  public container = new Container();
  private sprite = new Sprite();

  constructor() {
    this.container.addChild(this.sprite);
  }

  load(effect: EffectResource) {
    // Stub: will load effect frames and play animation
    console.log("EffectPlayer.load:", effect.id);
  }

  play() {
    // Stub: play effect animation
  }

  stop() {
    // Stub: stop and hide
    this.sprite.texture = Texture.EMPTY;
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
