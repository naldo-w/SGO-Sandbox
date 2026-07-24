import { Container } from "pixi.js";

export class Camera {
  public container = new Container();
  private _zoom = 1;
  private _x = 0;
  private _y = 0;

  get zoom() {
    return this._zoom;
  }

  set zoom(value: number) {
    this._zoom = Math.max(0.125, Math.min(4, value));
    this.container.scale.set(this._zoom);
  }

  moveTo(x: number, y: number) {
    this._x = x;
    this._y = y;
    this.container.position.set(-x, -y);
  }

  pan(dx: number, dy: number) {
    this.moveTo(this._x + dx, this._y + dy);
  }

  reset() {
    this._zoom = 1;
    this._x = 0;
    this._y = 0;
    this.container.position.set(0, 0);
    this.container.scale.set(1);
  }
}
