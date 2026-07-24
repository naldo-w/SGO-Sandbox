import { Container, Sprite } from "pixi.js";
import type { PartSlot } from "../assets/contract";
import type { LayerDefinition } from "../data/layers/LayerDefinition";

export class PaperDoll {
  public container = new Container();
  private layerSprites = new Map<string, Sprite>();
  private _layerDefs: LayerDefinition[] = [];

  constructor(layerDefs?: LayerDefinition[]) {
    if (layerDefs) this.setLayerDefs(layerDefs);
  }

  setLayerDefs(defs: LayerDefinition[]) {
    this._layerDefs = [...defs].sort((a, b) => a.zIndex - b.zIndex);
    this.container.removeChildren();
    this.layerSprites.clear();
    for (const def of this._layerDefs) {
      const sprite = new Sprite();
      sprite.visible = false;
      sprite.anchor.set(0.5, 0.5);
      sprite.label = def.id;
      this.container.addChild(sprite);
      this.layerSprites.set(def.id, sprite);
    }
  }

  getLayerDefs(): LayerDefinition[] {
    return this._layerDefs;
  }

  setLayerTexture(
    layerId: string,
    texture: import("pixi.js").Texture,
    anchor?: [number, number]
  ) {
    const sprite = this.layerSprites.get(layerId);
    if (!sprite) return;
    sprite.texture = texture;
    sprite.visible = true;
    if (anchor) sprite.anchor.set(anchor[0], anchor[1]);
  }

  getLayerSprite(layerId: string): Sprite | undefined {
    return this.layerSprites.get(layerId);
  }

  setLayerOpacity(layerId: string, alpha: number) {
    const sprite = this.layerSprites.get(layerId);
    if (sprite) sprite.alpha = alpha;
  }

  setLayerVisible(layerId: string, visible: boolean) {
    const sprite = this.layerSprites.get(layerId);
    if (sprite) sprite.visible = visible;
  }

  hideLayer(layerId: string) {
    const sprite = this.layerSprites.get(layerId);
    if (sprite) sprite.visible = false;
  }

  hideAll() {
    for (const sprite of this.layerSprites.values()) {
      sprite.visible = false;
    }
  }
}
