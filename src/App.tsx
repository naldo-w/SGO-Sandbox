import { useEffect, useRef, useState } from "react";
import { Renderer } from "./engine/Renderer";
import { DebugScene } from "./engine/DebugScene";
import { assetLoader, type LoadResult } from "./assets/AssetLoader";
import { AssetBrowser } from "./ui/AssetBrowser";
import { CharacterPanel } from "./character/CharacterPanel";

type AppPhase = "init" | "loading" | "ready" | "error";
type Tab = "assets" | "character";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const debugRef = useRef<DebugScene | null>(null);
  const [phase, setPhase] = useState<AppPhase>("init");
  const [loadResult, setLoadResult] = useState<LoadResult | null>(null);
  const [tab, setTab] = useState<Tab>("assets");

  useEffect(() => {
    const renderer = new Renderer();
    rendererRef.current = renderer;
    const debug = new DebugScene();
    debugRef.current = debug;

    renderer
      .init(canvasRef.current!, 800, 600)
      .then(() => {
        renderer.app.stage.addChild(debug.container);
        debug.setInfo("Renderer: OK");

        setPhase("loading");
        return assetLoader.loadIndex();
      })
      .then((result) => {
        setLoadResult(result);
        if (result.status === "success") {
          debug.setInfo(
            `Assets: ${result.assetCount} loaded (${JSON.stringify(assetLoader.getCategoryCounts())})`
          );
          renderer.app.stage.removeChild(debug.container);
          setPhase("ready");
        } else {
          debug.setInfo(`Error: ${result.error}`);
          setPhase("error");
        }
      });

    const animLoop = () => {
      debug.update(renderer);
      requestAnimationFrame(animLoop);
    };
    requestAnimationFrame(animLoop);

    const handleResize = () => {
      renderer.resize(800, 600);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.destroy();
    };
  }, []);

  return (
    <div style={styles.root}>
      <div ref={canvasRef} style={styles.canvas} />
      <div style={styles.panel}>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === "assets" ? styles.tabActive : {}) }}
            onClick={() => setTab("assets")}
          >
            Assets
          </button>
          <button
            style={{ ...styles.tab, ...(tab === "character" ? styles.tabActive : {}) }}
            onClick={() => setTab("character")}
          >
            Character
          </button>
        </div>
        {phase === "loading" && (
          <div style={styles.status}>
            <div style={styles.spinner} />
            <div>Loading assets...</div>
          </div>
        )}
        {phase === "error" && (
          <div style={styles.status}>
            <div style={{ color: "var(--danger)", fontWeight: 600 }}>
              Failed to load assets
            </div>
            <div style={{ fontSize: 12, marginTop: 8, color: "var(--text-dim)" }}>
              {loadResult?.error}
            </div>
          </div>
        )}
        {phase === "ready" && tab === "assets" && <AssetBrowser />}
        {phase === "ready" && tab === "character" && <CharacterPanel />}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    width: "100vw",
    height: "100vh",
  },
  canvas: {
    flex: 1,
    overflow: "hidden",
  },
  panel: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-panel)",
    borderLeft: "1px solid var(--border)",
  },
  tabs: {
    display: "flex",
    borderBottom: "1px solid var(--border)",
  },
  tab: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "var(--text-dim)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    color: "var(--accent)",
    borderBottomColor: "var(--accent)",
  },
  status: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "12px",
    padding: "24px",
    textAlign: "center",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "2px solid var(--border)",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default App;
