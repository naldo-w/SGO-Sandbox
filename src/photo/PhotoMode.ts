import { Application, Container, Graphics } from "pixi.js";
import type { PhotoSettings } from "./PhotoSettings";
import { defaultPhotoSettings, getScaleFactor } from "./PhotoSettings";

export class PhotoMode {
  private app: Application | null = null;
  private photoContainer: Container = new Container();
  private bg: Graphics = new Graphics();
  private settings: PhotoSettings = defaultPhotoSettings();
  private sourceContainer: Container | null = null;

  get isActive(): boolean {
    return this.app !== null;
  }

  get currentSettings(): PhotoSettings {
    return this.settings;
  }

  attach(
    app: Application,
    characterContainer: Container | null
  ): void {
    this.app = app;
    this.sourceContainer = characterContainer;

    this.photoContainer = new Container();
    this.bg = new Graphics();

    app.stage.addChildAt(this.bg, 0);
    app.stage.addChild(this.photoContainer);

    if (characterContainer) {
      this.photoContainer.addChild(characterContainer);
    }

    this.applySettings(this.settings);
  }

  detach(): void {
    if (!this.app) return;

    if (this.sourceContainer && this.photoContainer.children.includes(this.sourceContainer)) {
      this.photoContainer.removeChild(this.sourceContainer);
      this.app.stage.addChildAt(this.sourceContainer, this.app.stage.children.length - 1);
    }

    if (this.bg.parent) this.app.stage.removeChild(this.bg);
    if (this.photoContainer.parent) this.app.stage.removeChild(this.photoContainer);

    this.app = null;
  }

  applySettings(settings: PhotoSettings): void {
    this.settings = settings;
    if (!this.app) return;

    const w = settings.resolution.width;
    const h = settings.resolution.height;
    const scale = getScaleFactor(settings.scale);

    this.app.renderer.resize(w * scale, h * scale);
    this.app.stage.scale.set(scale);

    this.bg.clear();
    this.bg.beginFill(parseInt(settings.backgroundColor.replace("#", ""), 16));
    this.bg.drawRect(0, 0, w, h);
    this.bg.endFill();

    this.photoContainer.x = w / 2 + settings.panX;
    this.photoContainer.y = h / 2 + settings.panY;
    this.photoContainer.scale.set(settings.zoom);

    this.photoContainer.visible = settings.showCharacter;
  }

  async capture(): Promise<Blob | null> {
    if (!this.app) return null;
    const canvas = this.app.canvas as HTMLCanvasElement;
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  async captureToURL(): Promise<string> {
    const blob = await this.capture();
    if (!blob) return "";
    return URL.createObjectURL(blob);
  }

  download(filename: string = "sgo-screenshot.png"): void {
    this.capture().then((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}

export const photoMode = new PhotoMode();
