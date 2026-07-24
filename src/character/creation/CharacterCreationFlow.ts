import type { CharacterConfig } from "../types";
import type { CreationState } from "./CreationState";
import { initialCreationState, canProceed } from "./CreationState";

export interface CreationCallbacks {
  onComplete: (config: CharacterConfig) => void;
  onCancel: () => void;
}

export class CharacterCreationFlow {
  public state: CreationState;
  private callbacks: CreationCallbacks;

  constructor(callbacks: CreationCallbacks) {
    this.state = initialCreationState();
    this.callbacks = callbacks;
  }

  setRace(race: string): void {
    this.state = {
      ...this.state,
      race,
      gender: null,
      body: null,
      face: null,
      hair: null,
      step: "select-gender",
    };
  }

  setGender(gender: string): void {
    this.state = { ...this.state, gender, step: "select-body" };
  }

  setBody(body: string): void {
    this.state = { ...this.state, body, step: "select-face" };
  }

  setFace(face: string): void {
    this.state = { ...this.state, face, step: "select-hair" };
  }

  setHair(hair: string): void {
    this.state = { ...this.state, hair, step: "confirm" };
  }

  setName(name: string): void {
    this.state = { ...this.state, name };
  }

  goBack(): void {
    const order = ["select-race", "select-gender", "select-body", "select-face", "select-hair", "confirm"];
    const idx = order.indexOf(this.state.step);
    if (idx > 0) {
      this.state = { ...this.state, step: order[idx - 1] as CreationState["step"] };
    }
  }

  canProceed(): boolean {
    return canProceed(this.state);
  }

  confirm(): void {
    if (!this.canProceed()) return;
    const cfg: CharacterConfig = {
      race: this.state.race ?? "human-male",
      gender: this.state.gender ?? "male",
      name: this.state.name || "New Character",
      body: this.state.body ?? "",
      equipment: {
        ...(this.state.body ? { body: this.state.body } : {}),
        ...(this.state.face ? { face: this.state.face } : {}),
        ...(this.state.hair ? { hair: this.state.hair } : {}),
      },
      appearance: {},
      direction: "S",
      animation: "idle",
      expression: "normal",
    };
    this.callbacks.onComplete(cfg);
  }

  cancel(): void {
    this.callbacks.onCancel();
  }

  reset(): void {
    this.state = initialCreationState();
  }
}
