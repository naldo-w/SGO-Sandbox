import { Container } from "pixi.js";

export class Scene {
  public container = new Container();

  constructor() {
    this.container.sortableChildren = true;
  }

  addChild(child: Container) {
    this.container.addChild(child);
  }

  removeChild(child: Container) {
    this.container.removeChild(child);
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
