import { create } from "zustand";

interface SandboxState {
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  selectedSprite: string | null;
  playing: boolean;
  speed: number;
  currentFrame: number;
  direction: string;
  action: string;
  uiVisible: boolean;
  zoom: number;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedSprite: (id: string | null) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setCurrentFrame: (frame: number) => void;
  setDirection: (dir: string) => void;
  setAction: (action: string) => void;
  toggleUi: () => void;
  setZoom: (zoom: number) => void;
}

export const useSandboxStore = create<SandboxState>((set) => ({
  loading: true,
  error: null,
  selectedCategory: "Enemy",
  selectedSprite: null,
  playing: false,
  speed: 1,
  currentFrame: 0,
  direction: "NS",
  action: "idle",
  uiVisible: true,
  zoom: 1,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedSprite: (selectedSprite) => set({ selectedSprite }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  setCurrentFrame: (currentFrame) => set({ currentFrame }),
  setDirection: (direction) => set({ direction }),
  setAction: (action) => set({ action }),
  toggleUi: () => set((s) => ({ uiVisible: !s.uiVisible })),
  setZoom: (zoom) => set({ zoom }),
}));
