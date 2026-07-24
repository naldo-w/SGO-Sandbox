import { useEffect, useRef, useState, useCallback } from "react";
import { Application, Assets, Sprite, Graphics, Text, TextStyle } from "pixi.js";
import type { AssetEntry, Animation, DirectionEntry } from "../assets/contract";
import { assetLoader } from "../assets/AssetLoader";
import { PlayerControls } from "./PlayerControls";

interface AssetPreviewProps {
  asset: AssetEntry | null;
}

export function AssetPreview({ asset }: AssetPreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const spriteRef = useRef<Sprite | null>(null);
  const infoTextRef = useRef<Text | null>(null);
  const containerRef = useRef<import("pixi.js").Container | null>(null);

  const [animation, setAnimation] = useState<Animation | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedDir, setSelectedDir] = useState("default");
  const [totalFrames, setTotalFrames] = useState(0);
  const [directions, setDirections] = useState<Record<string, DirectionEntry> | null>(null);
  const [frameFiles, setFrameFiles] = useState<string[]>([]);
  const [animFps, setAnimFps] = useState(8);
  const [loadingStatus, setLoadingStatus] = useState("");

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!asset || !canvasRef.current) {
      setAnimation(null);
      setCurrentFrame(0);
      setIsPlaying(false);
      setTotalFrames(0);
      setFrameFiles([]);
      setDirections(null);
      setAnimFps(8);
      setLoadingStatus("");
      return;
    }

    let destroyed = false;

    const app = new Application();
    appRef.current = app;

    app.init({
      width: 320,
      height: 280,
      backgroundColor: 0x1a1a2e,
      antialias: true,
    }).then(() => {
      if (destroyed || !canvasRef.current) return;
      canvasRef.current.appendChild(app.canvas as HTMLCanvasElement);

      const bg = new Graphics();
      bg.beginFill(0x1a1a2e);
      bg.drawRect(0, 0, 320, 280);
      bg.endFill();
      bg.beginFill(0x252540);
      bg.drawRect(0, 140, 320, 1);
      bg.endFill();
      app.stage.addChild(bg);

      const container = new import("pixi.js").Container();
      containerRef.current = container;
      app.stage.addChild(container);

      const infoText = new Text({
        text: "",
        style: new TextStyle({ fill: 0x707088, fontSize: 12, fontFamily: "monospace" }),
      });
      infoText.position.set(12, 148);
      infoTextRef.current = infoText;
      app.stage.addChild(infoText);

      loadAsset(asset, app, container);
    });

    return () => {
      destroyed = true;
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      app.destroy(true);
      appRef.current = null;
      spriteRef.current = null;
      infoTextRef.current = null;
      containerRef.current = null;
    };
  }, [asset]);

  useEffect(() => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    if (!isPlaying || frameFiles.length === 0) return;

    const ms = 1000 / (animFps * speed);
    intervalRef.current = window.setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameFiles.length);
    }, ms);

    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, animFps, frameFiles.length]);

  const loadAsset = useCallback(
    async (asset: AssetEntry, app: Application, container: import("pixi.js").Container) => {
      setLoadingStatus("Loading animation data...");
      try {
        const anim = await assetLoader.loadAnimation(asset.path);
        if (destroyed()) return;

        setAnimation(anim);

        const dirNames = anim.directions ? Object.keys(anim.directions) : ["default"];
        const initialDir = dirNames[0];
        setDirections(anim.directions ?? null);
        setSelectedDir(initialDir);

        const dirEntry = anim.directions?.[initialDir];
        if (dirEntry) {
          setAnimFps(dirEntry.fps || anim.fps);
          setTotalFrames(dirEntry.frame_count);
        } else {
          setAnimFps(anim.fps);
          setTotalFrames(anim.frames.length);
        }

        const allFrames = anim.frames.map((f) => f.file);
        let fnames: string[];
        if (dirEntry && anim.directions) {
          const ids = dirEntry.dir_ids;
          fnames = allFrames.filter((_, i) => ids.includes(i));
        } else {
          fnames = allFrames;
        }
        setFrameFiles(fnames);
        setCurrentFrame(0);
        setIsPlaying(true);

        await showFrame(fnames[0], asset, app, container);
        setLoadingStatus("");
      } catch (e) {
        if (!destroyed()) {
          setLoadingStatus("No animation data available");
          showAssetInfo(asset, app, container);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!animation || frameFiles.length === 0 || !appRef.current || !containerRef.current) return;
    const app = appRef.current;
    const container = containerRef.current;

    const fname = frameFiles[currentFrame];
    if (!fname) return;

    showFrame(fname, null, app, container);
  }, [currentFrame, animation, frameFiles]);

  function destroyed() {
    return !appRef.current || !containerRef.current;
  }

  async function showFrame(
    fname: string,
    fallbackAsset: AssetEntry | null,
    app: Application,
    container: import("pixi.js").Container
  ) {
    const assetId = fallbackAsset ?? asset;
    if (!assetId) return;

    const url = assetLoader.getFrameUrl(assetId.path, fname);
    try {
      const texture = await Assets.load(url);
      if (destroyed()) return;

      if (spriteRef.current) {
        spriteRef.current.texture = texture;
        spriteRef.current.scale.set(1);
      } else {
        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.position.set(160, 70);
        spriteRef.current = sprite;
        container.addChild(sprite);
      }

      const s = spriteRef.current;
      const maxW = 280;
      const maxH = 120;
      const scale = Math.min(maxW / Math.max(s.width, 1), maxH / Math.max(s.height, 1), 4);
      s.scale.set(scale);
      s.position.set(160, 70);
    } catch {
      if (spriteRef.current) {
        spriteRef.current.visible = false;
      }
    }

    if (infoTextRef.current) {
      const dirLabel = selectedDir !== "default" ? ` dir:${selectedDir}` : "";
      infoTextRef.current.text =
        `frame ${currentFrame + 1}/${totalFrames} | ${fpsText()}${dirLabel} | ${fname}`;
    }
  }

  function fpsText() {
    return `${animFps * speed} fps (${speed}x)`;
  }

  function showAssetInfo(
    asset: AssetEntry,
    app: Application,
    container: import("pixi.js").Container
  ) {
    const txt = new Text({
      text: `${asset.id}\ntype: ${asset.type}\npath: ${asset.path}`,
      style: new TextStyle({
        fill: 0xc0c0d0,
        fontSize: 11,
        fontFamily: "monospace",
        lineHeight: 16,
      }),
    });
    txt.position.set(12, 12);
    container.addChild(txt);
  }

  const handleTogglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const handlePrevFrame = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrame((p) => (p > 0 ? p - 1 : frameFiles.length - 1));
  }, [frameFiles.length]);
  const handleNextFrame = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrame((p) => (p + 1) % frameFiles.length);
  }, [frameFiles.length]);
  const handleSetFrame = useCallback((f: number) => {
    setIsPlaying(false);
    setCurrentFrame(f);
  }, []);
  const handleSpeedChange = useCallback((s: number) => setSpeed(s), []);
  const handleDirectionChange = useCallback(
    (d: string) => {
      setSelectedDir(d);
      setIsPlaying(false);
      setCurrentFrame(0);

      if (!animation?.directions) return;
      const dirEntry = animation.directions[d];
      if (!dirEntry) return;

      setAnimFps(dirEntry.fps || animation.fps);
      setTotalFrames(dirEntry.frame_count);

      const ids = dirEntry.dir_ids;
      const allFrames = animation.frames.map((f) => f.file);
      const fnames = allFrames.filter((_, i) => ids.includes(i));
      setFrameFiles(fnames);

      if (fnames.length > 0 && appRef.current && containerRef.current) {
        showFrame(fnames[0], null, appRef.current, containerRef.current);
      }
    },
    [animation]
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {asset ? (
          <div style={styles.headerContent}>
            <span style={styles.headerId}>{asset.id}</span>
            <span style={styles.headerType}>{asset.type}</span>
          </div>
        ) : (
          "No selection"
        )}
      </div>
      <div ref={canvasRef} style={styles.canvas} />
      {loadingStatus && (
        <div style={styles.loading}>{loadingStatus}</div>
      )}
      {animation && (
        <PlayerControls
          animation={animation}
          currentFrame={currentFrame}
          isPlaying={isPlaying}
          speed={speed}
          totalFrames={totalFrames}
          selectedDirection={selectedDir}
          directions={directions}
          onTogglePlay={handleTogglePlay}
          onPrevFrame={handlePrevFrame}
          onNextFrame={handleNextFrame}
          onSetFrame={handleSetFrame}
          onSpeedChange={handleSpeedChange}
          onDirectionChange={handleDirectionChange}
        />
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-panel)",
  },
  header: {
    padding: "10px 16px",
    borderBottom: "1px solid var(--border)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-bright)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerId: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  headerType: {
    fontSize: "11px",
    color: "var(--accent)",
    fontWeight: 500,
    textTransform: "uppercase",
    marginLeft: "8px",
    flexShrink: 0,
  },
  canvas: {
    width: "320px",
    height: "280px",
    flexShrink: 0,
  },
  loading: {
    padding: "12px",
    fontSize: "12px",
    color: "var(--text-dim)",
    textAlign: "center",
  },
};
