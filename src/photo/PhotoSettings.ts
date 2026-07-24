export interface PhotoResolution {
  label: string;
  width: number;
  height: number;
}

export const PHOTO_RESOLUTIONS: PhotoResolution[] = [
  { label: "1:1",  width: 1080, height: 1080 },
  { label: "3:4",  width: 1080, height: 1440 },
  { label: "9:16", width: 1080, height: 1920 },
  { label: "16:9", width: 1920, height: 1080 },
];

export type ScaleMode = "pixel-perfect" | "nearest-x2" | "nearest-x3" | "nearest-x4";

export interface PhotoSettings {
  resolution: PhotoResolution;
  scale: ScaleMode;
  zoom: number;
  panX: number;
  panY: number;
  backgroundColor: string;
  showCharacter: boolean;
  showBackground: boolean;
}

export function defaultPhotoSettings(): PhotoSettings {
  return {
    resolution: PHOTO_RESOLUTIONS[0],
    scale: "pixel-perfect",
    zoom: 1,
    panX: 0,
    panY: 0,
    backgroundColor: "#0f0f1a",
    showCharacter: true,
    showBackground: false,
  };
}

export function getScaleFactor(mode: ScaleMode): number {
  switch (mode) {
    case "pixel-perfect": return 1;
    case "nearest-x2":    return 2;
    case "nearest-x3":    return 3;
    case "nearest-x4":    return 4;
  }
}
