import { Container, Graphics } from "pixi.js";

export class MapRenderer {
  public container = new Container();
  private grid: Graphics | null = null;

  renderPlaceholder(width: number, height: number, tileSize: number) {
    if (this.grid) {
      this.container.removeChild(this.grid);
      this.grid.destroy();
    }
    this.grid = new Graphics();
    this.grid.lineStyle(1, 0x333355, 0.3);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.grid.drawRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
    this.container.addChild(this.grid);
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
