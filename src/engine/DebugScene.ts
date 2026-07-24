import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { Renderer } from "./Renderer";

export class DebugScene {
  public container = new Container();
  private fpsText: Text;
  private infoText: Text;
  private bg: Graphics;
  private frames = 0;
  private lastTime = performance.now();

  constructor() {
    this.bg = new Graphics();
    this.bg.beginFill(0x1a1a2e);
    this.bg.drawRect(0, 0, 200, 80);
    this.bg.endFill();
    this.bg.beginFill(0x2a2a4e, 0.5);
    this.bg.drawRect(0, 0, 200, 80);
    this.bg.endFill();
    this.container.addChild(this.bg);

    const style = new TextStyle({
      fontFamily: "monospace",
      fontSize: 12,
      fill: 0x88ff88,
    });
    this.fpsText = new Text({ text: "FPS: --", style });
    this.fpsText.position.set(8, 8);
    this.container.addChild(this.fpsText);

    this.infoText = new Text({ text: "PixiJS: initializing...", style });
    this.infoText.position.set(8, 28);
    this.container.addChild(this.infoText);

    const testShape = new Graphics();
    testShape.beginFill(0xff6644);
    testShape.drawRoundedRect(400, 300, 64, 64, 8);
    testShape.endFill();
    testShape.beginFill(0x44aaff);
    testShape.drawCircle(432, 332, 16);
    testShape.endFill();
    this.container.addChild(testShape);

    const logo = new Text({
      text: "SGO-Sandbox",
      style: new TextStyle({
        fontFamily: "system-ui, sans-serif",
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    logo.position.set(8, 56);
    this.container.addChild(logo);
  }

  update(renderer: Renderer) {
    this.frames++;
    const now = performance.now();
    const dt = now - this.lastTime;
    if (dt >= 1000) {
      const fps = Math.round((this.frames * 1000) / dt);
      this.fpsText.text = `FPS: ${fps}`;
      this.infoText.text =
        `Canvas: ${renderer.app.canvas.width}x${renderer.app.canvas.height} | ` +
        `Res: ${renderer.app.renderer.resolution}`;
      this.frames = 0;
      this.lastTime = now;
    }
  }

  setInfo(text: string) {
    this.infoText.text = text;
  }
}
