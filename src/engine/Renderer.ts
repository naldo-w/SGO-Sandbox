import { Application } from "pixi.js";

export class Renderer {
  public app: Application;

  constructor() {
    this.app = new Application();
  }

  async init(container: HTMLElement, width: number, height: number) {
    await this.app.init({
      width,
      height,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    container.appendChild(this.app.canvas as HTMLCanvasElement);
  }

  resize(width: number, height: number) {
    this.app.renderer.resize(width, height);
  }

  destroy() {
    this.app.destroy(true);
  }
}
