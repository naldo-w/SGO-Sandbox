import { Container, Sprite } from "pixi.js";
import type { PartSlot } from "../assets/contract";

const LAYER_ORDER: PartSlot[] = [
  "Back", "Leg", "R-Arm", "Body", "L-Arm",
  "R-Shoulder", "L-Shoulder", "Bonnet",
];

export class PaperDoll {
  public container = new Container();
  private layers = new Map<PartSlot, Sprite>();

  constructor() {
    for (const slot of LAYER_ORDER) {
      const sprite = new Sprite();
      sprite.visible = false;
      this.container.addChild(sprite);
      this.layers.set(slot, sprite);
    }
  }

  setLayerTexture(slot: PartSlot, texture: import("pixi.js").Texture, anchor: [number, number]) {
    const sprite = this.layers.get(slot);
    if (!sprite) return;
    sprite.texture = texture;
    sprite.anchor.set(anchor[0], anchor[1]);
    sprite.visible = true;
  }

  hideLayer(slot: PartSlot) {
    this.layers.get(slot)!.visible = false;
  }

  hideAll() {
    for (const sprite of this.layers.values()) {
      sprite.visible = false;
    }
  }
}
