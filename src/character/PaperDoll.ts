import { Container, Sprite } from "pixi.js";
import type { PartSlot } from "../assets/contract";

export const LAYER_ORDER: PartSlot[] = [
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
      sprite.anchor.set(0.5, 0.5);
      this.container.addChild(sprite);
      this.layers.set(slot, sprite);
    }
  }

  setLayerTexture(
    slot: PartSlot,
    texture: import("pixi.js").Texture,
    anchor?: [number, number]
  ) {
    const sprite = this.layers.get(slot);
    if (!sprite) return;
    sprite.texture = texture;
    sprite.visible = true;
    if (anchor) {
      sprite.anchor.set(anchor[0], anchor[1]);
    }
  }

  getLayerSprite(slot: PartSlot): Sprite | undefined {
    return this.layers.get(slot);
  }

  setLayerOpacity(slot: PartSlot, alpha: number) {
    const sprite = this.layers.get(slot);
    if (sprite) sprite.alpha = alpha;
  }

  setLayerVisible(slot: PartSlot, visible: boolean) {
    const sprite = this.layers.get(slot);
    if (sprite) sprite.visible = visible;
  }

  hideLayer(slot: PartSlot) {
    const sprite = this.layers.get(slot);
    if (sprite) sprite.visible = false;
  }

  hideAll() {
    for (const sprite of this.layers.values()) {
      sprite.visible = false;
    }
  }
}
