import { useEffect, useRef, useCallback } from "react";
import { Application, Assets, Container, Text, TextStyle } from "pixi.js";
import { PaperDoll } from "./PaperDoll";
import { usePaperdollStore } from "./paperdollStore";
import { assetLoader } from "../assets/AssetLoader";
import { resolveLayers } from "./types";
import type { ResolvedLayer } from "./types";

export function PaperDollView() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const paperDollRef = useRef<PaperDoll | null>(null);
  const statusRef = useRef<Text | null>(null);
  const frameCountRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  const config = usePaperdollStore((s) => s.config);

  useEffect(() => {
    if (!canvasRef.current) return;
    let destroyed = false;

    const app = new Application();
    appRef.current = app;

    app
      .init({ width: 320, height: 320, backgroundColor: 0x0f0f1a, antialias: true })
      .then(() => {
        if (destroyed || !canvasRef.current) return;
        canvasRef.current.appendChild(app.canvas as HTMLCanvasElement);

        const pd = new PaperDoll();
        paperDollRef.current = pd;
        pd.container.position.set(160, 160);
        app.stage.addChild(pd.container);

        const st = new Text({
          text: "",
          style: new TextStyle({ fill: 0x707088, fontSize: 11, fontFamily: "monospace" }),
        });
        st.position.set(8, 8);
        statusRef.current = st;
        app.stage.addChild(st);

        applyLayers(pd, resolveLayers({ ...config }));

        lastTimeRef.current = performance.now();
        function tick() {
          if (destroyed) return;
          const now = performance.now();
          const dt = (now - lastTimeRef.current) / 1000;
          lastTimeRef.current = now;
          frameCountRef.current++;
          rafRef.current = requestAnimationFrame(tick);
        }
        rafRef.current = requestAnimationFrame(tick);
      });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      app.destroy(true);
      appRef.current = null;
      paperDollRef.current = null;
      statusRef.current = null;
    };
  }, []);

  useEffect(() => {
    const pd = paperDollRef.current;
    if (!pd) return;
    applyLayers(pd, resolveLayers({ ...config }));

    if (statusRef.current) {
      statusRef.current.text = `${config.race} · ${config.direction} · ${config.animation}`;
    }
  }, [config]);

  const applyLayers = useCallback(
    async (pd: PaperDoll, layers: ResolvedLayer[]) => {
      pd.hideAll();
      for (const l of layers) {
        try {
          const meta = await assetLoader.loadMetadata(l.assetRef.assetId);
          if (!meta) continue;
          const firstFrame = meta.original_file || "frame_000.webp";
          const url = assetLoader.getFrameUrl(l.assetRef.assetId, firstFrame);
          const texture = await Assets.load(url);
          if (!texture) continue;
          pd.setLayerTexture(
            l.renderSlot,
            texture,
            l.assetRef.anchorOverride ?? [0.5, 0.5]
          );
        } catch {
          // skip layer
        }
      }
    },
    []
  );

  return (
    <div style={styles.container}>
      <div ref={canvasRef} style={styles.canvas} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "320px",
    height: "320px",
    flexShrink: 0,
  },
  canvas: {
    width: "320px",
    height: "320px",
  },
};
