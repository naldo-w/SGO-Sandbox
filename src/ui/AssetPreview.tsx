import { useEffect, useRef } from "react";
import { Application, Graphics, Text, TextStyle } from "pixi.js";
import type { AssetEntry } from "../assets/contract";
import { assetLoader } from "../assets/AssetLoader";

interface AssetPreviewProps {
  asset: AssetEntry | null;
}

export function AssetPreview({ asset }: AssetPreviewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application();
    appRef.current = app;

    app.init({
      width: 320,
      height: 240,
      backgroundColor: 0x1a1a2e,
      antialias: true,
    }).then(() => {
      canvasRef.current!.appendChild(app.canvas as HTMLCanvasElement);

      const bg = new Graphics();
      bg.beginFill(0x1a1a2e);
      bg.drawRect(0, 0, 320, 240);
      bg.endFill();
      bg.beginFill(0x252540);
      bg.drawRect(0, 120, 320, 1);
      bg.endFill();
      app.stage.addChild(bg);

      if (!asset) {
        const text = new Text({
          text: "Select an asset to preview",
          style: new TextStyle({ fill: 0x707088, fontSize: 13 }),
        });
        text.anchor.set(0.5);
        text.position.set(160, 120);
        app.stage.addChild(text);
      } else {
        const text = new Text({
          text: `${asset.id}\ntype: ${asset.type}\npath: ${asset.path}`,
          style: new TextStyle({
            fill: 0xc0c0d0,
            fontSize: 12,
            fontFamily: "monospace",
            lineHeight: 18,
          }),
        });
        text.position.set(16, 16);
        app.stage.addChild(text);

        if (asset.animation) {
          assetLoader.loadAnimation(asset.path).then((anim) => {
            const info = new Text({
              text:
                `Frames: ${anim.frames.length}\n` +
                `FPS: ${anim.fps}\n` +
                `Directions: ${anim.directions ? Object.keys(anim.directions).join(", ") : "none"}`,
              style: new TextStyle({
                fill: 0x88ff88,
                fontSize: 11,
                fontFamily: "monospace",
                lineHeight: 16,
              }),
            });
            info.position.set(16, 100);
            app.stage.addChild(info);
          }).catch(() => {
            // animation.json not available
          });
        }
      }
    });

    return () => {
      app.destroy(true);
      appRef.current = null;
    };
  }, [asset]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {asset ? asset.id : "No selection"}
      </div>
      <div ref={canvasRef} style={styles.canvas} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    borderLeft: "1px solid var(--border)",
    width: "320px",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-panel)",
  },
  header: {
    padding: "10px 16px",
    borderBottom: "1px solid var(--border)",
    color: "var(--text-bright)",
    fontWeight: 600,
    fontSize: "13px",
  },
  canvas: {
    width: "320px",
    height: "240px",
  },
};
