import { useEffect, useRef } from "react";
import { Application, Assets, Text, TextStyle } from "pixi.js";
import { PaperDoll } from "./PaperDoll";
import { CharacterAnimator } from "./CharacterAnimator";
import { usePaperdollStore } from "./paperdollStore";
import { EQUIP_SLOTS, EQUIP_TO_RENDER } from "./types";
import type { CharacterConfig, LayerState } from "./types";

export function PaperDollView() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const pdRef = useRef<PaperDoll | null>(null);
  const animRef = useRef<CharacterAnimator | null>(null);
  const statusRef = useRef<Text | null>(null);

  const configRef = useRef<CharacterConfig>(usePaperdollStore.getState().config);
  const layerStatesRef = useRef<Record<string, LayerState>>(usePaperdollStore.getState().layerStates);

  useEffect(() => {
    const unsub = usePaperdollStore.subscribe((s) => {
      configRef.current = s.config;
      layerStatesRef.current = s.layerStates;
    });
    return unsub;
  }, []);

  const setAnimFrame = usePaperdollStore((s) => s.setAnimFrame);

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
        pdRef.current = pd;
        pd.container.position.set(160, 160);
        app.stage.addChild(pd.container);

        const anim = new CharacterAnimator();
        anim.play();
        animRef.current = anim;

        const st = new Text({
          text: "",
          style: new TextStyle({ fill: 0x707088, fontSize: 11, fontFamily: "monospace" }),
        });
        st.position.set(8, 8);
        statusRef.current = st;
        app.stage.addChild(st);

        let lastTime = performance.now();
        function tick() {
          if (destroyed) return;
          const now = performance.now();
          const dt = (now - lastTime) / 1000;
          lastTime = now;

          const cfg = configRef.current;
          const anim2 = animRef.current!;
          anim2.setDirection(cfg.direction);
          anim2.setState(cfg.animation);

          if (anim2.playing) {
            anim2.update(dt);
            setAnimFrame(anim2.currentFrame);
          }

          updateLayers(pd, anim2, cfg);
          applyVisibility(pd, cfg);
          st.text =
            `${cfg.race} · ${cfg.direction} · ${cfg.animation} ` +
            `| frame ${anim2.currentFrame} ${anim2.playing ? "▶" : "⏸"}`;
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });

    return () => {
      destroyed = true;
      app.destroy(true);
      appRef.current = null;
      pdRef.current = null;
      animRef.current = null;
      statusRef.current = null;
    };
  }, []);

  const texCache = useRef<Map<string, import("pixi.js").Texture>>(new Map());

  function updateLayers(
    pd: PaperDoll,
    anim: CharacterAnimator,
    cfg: CharacterConfig
  ) {
    for (const equipSlot of EQUIP_SLOTS) {
      const ref = cfg.layers[equipSlot];
      if (!ref?.assetId) continue;

      const frameFile = anim.getFrameFile(ref.assetId);
      if (!frameFile) continue;

      const cacheKey = `${ref.assetId}:${frameFile}`;
      const renderSlots = EQUIP_TO_RENDER[equipSlot];

      if (texCache.current.has(cacheKey)) {
        const tex = texCache.current.get(cacheKey)!;
        for (const rs of renderSlots) {
          pd.setLayerTexture(rs, tex);
        }
        continue;
      }

      const base = import.meta.env.VITE_GAME_ASSET_PATH || "/GameAssets";
      const url = `${base}/${ref.assetId}/${frameFile}`;

      Assets.load(url).then((tex) => {
        texCache.current.set(cacheKey, tex);
        for (const rs of renderSlots) {
          pd.setLayerTexture(rs, tex);
        }
      });
    }
  }

  function applyVisibility(pd: PaperDoll, cfg: CharacterConfig) {
    for (const equipSlot of EQUIP_SLOTS) {
      const state = layerStatesRef.current[equipSlot];
      const hasItem = !!cfg.layers[equipSlot]?.assetId;
      const renderSlots = EQUIP_TO_RENDER[equipSlot];
      for (const rs of renderSlots) {
        pd.setLayerVisible(rs, hasItem && state.visible);
        pd.setLayerOpacity(rs, hasItem && state.visible ? state.alpha : 0);
      }
    }
  }

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
