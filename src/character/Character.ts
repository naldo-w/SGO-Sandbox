import { Container } from "pixi.js";
import { PaperDoll } from "./PaperDoll";
import { AnimationController } from "./AnimationController";

export class Character {
  public container = new Container();
  public paperDoll: PaperDoll;
  public animation: AnimationController;

  constructor() {
    this.paperDoll = new PaperDoll();
    this.animation = new AnimationController();
    this.container.addChild(this.paperDoll.container);
  }
}
