import { useEffect, useRef } from "react";
import { Renderer } from "./engine/Renderer";
import { Scene } from "./engine/Scene";
import { Camera } from "./engine/Camera";
import { assetLoader } from "./assets/AssetLoader";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderer = new Renderer();
    const scene = new Scene();
    const camera = new Camera();

    renderer.init(canvasRef.current!, 1024, 768).then(() => {
      renderer.app.stage.addChild(camera.container);
      camera.container.addChild(scene.container);
      assetLoader.loadIndex().then((idx) => {
        console.log(`SGO-Sandbox ready: ${idx.assets.length} assets`);
      });
    });

    const handleResize = () => {
      renderer.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.destroy();
    };
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
}

export default App;
