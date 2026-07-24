import type { PhotoSettings, PhotoResolution, ScaleMode } from "./PhotoSettings";

export interface ScreenshotPreset {
  name: string;
  settings: Partial<PhotoSettings>;
}

export const SCREENSHOT_PRESETS: ScreenshotPreset[] = [
  {
    name: "Square 1:1",
    settings: {
      resolution: { label: "1:1", width: 1080, height: 1080 },
      scale: "pixel-perfect",
    },
  },
  {
    name: "Portrait 3:4",
    settings: {
      resolution: { label: "3:4", width: 1080, height: 1440 },
      scale: "nearest-x2",
    },
  },
  {
    name: "Mobile 9:16",
    settings: {
      resolution: { label: "9:16", width: 1080, height: 1920 },
      scale: "nearest-x3",
    },
  },
  {
    name: "Desktop 16:9",
    settings: {
      resolution: { label: "16:9", width: 1920, height: 1080 },
      scale: "nearest-x4",
    },
  },
  {
    name: "Clean Capture",
    settings: {
      resolution: { label: "1:1", width: 1080, height: 1080 },
      scale: "pixel-perfect",
      showCharacter: true,
      showBackground: false,
    },
  },
];
