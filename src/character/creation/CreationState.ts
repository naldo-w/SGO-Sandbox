export type CreationStep =
  | "select-race"
  | "select-gender"
  | "select-body"
  | "select-face"
  | "select-hair"
  | "confirm";

export interface CreationState {
  step: CreationStep;
  race: string | null;
  gender: string | null;
  body: string | null;
  face: string | null;
  hair: string | null;
  name: string;
}

export function initialCreationState(): CreationState {
  return {
    step: "select-race",
    race: null,
    gender: null,
    body: null,
    face: null,
    hair: null,
    name: "",
  };
}

export function canProceed(state: CreationState): boolean {
  switch (state.step) {
    case "select-race":  return state.race !== null;
    case "select-gender": return state.gender !== null;
    case "select-body":  return state.body !== null;
    case "select-face":  return true;
    case "select-hair":  return true;
    case "confirm":      return state.name.trim().length > 0;
  }
}
