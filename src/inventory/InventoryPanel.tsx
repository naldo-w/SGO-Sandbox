import { useEffect, useState, useMemo, useRef } from "react";
import { Assets } from "pixi.js";
import { assetLoader } from "../assets/AssetLoader";
import type { AssetEntry } from "../assets/contract";
import { usePaperdollStore } from "../character/paperdollStore";
import { getInventoryCategories, inferInventorySubCategory } from "../data/game/AssetCategory";
import { getLayerById } from "../data/layers/defaultLayers";

const THUMB_SIZE = 48;

export function InventoryPanel() {
  const setLayer = usePaperdollStore((s) => s.setLayer);
  const equipment = usePaperdollStore((s) => s.config.equipment);

  const [allItems, setAllItems] = useState<AssetEntry[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [thumbMap, setThumbMap] = useState<Map<string, string>>(new Map());
  const loadingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const idx = assetLoader.getIndex();
    if (!idx) return;
    setAllItems(idx.assets.filter((a) => a.type === "sprite"));
  }, []);

  const categories = getInventoryCategories();

  const filtered = useMemo(() => {
    let result = allItems;
    if (catFilter) {
      result = result.filter(
        (a) => inferInventorySubCategory(a.id, a.path) === catFilter
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.id.toLowerCase().includes(q) || a.path.toLowerCase().includes(q)
      );
    }
    return result.slice(0, 200);
  }, [allItems, catFilter, search]);

  useEffect(() => {
    for (const item of filtered) {
      if (thumbMap.has(item.path) || loadingRef.current.has(item.path)) continue;
      loadingRef.current.add(item.path);
      loadThumb(item.path);
    }
  }, [filtered]);

  async function loadThumb(path: string) {
    try {
      const anim = await assetLoader.loadAnimation(path);
      if (!anim.frames.length) return;
      const frameFile = anim.frames[0].file;
      const base = import.meta.env.VITE_GAME_ASSET_PATH || "/GameAssets";
      const url = `${base}/${path}/${frameFile}`;
      await Assets.load(url);
      setThumbMap((prev) => new Map(prev).set(path, url));
    } catch {
      // no preview
    }
  }

  function handleEquip(entry: AssetEntry) {
    const sub = inferInventorySubCategory(entry.id, entry.path);
    const layerMatch = getLayerById(sub);
    const layerId = layerMatch?.id ?? "body";
    setLayer(layerId, entry.path);
  }

  function isEquipped(entry: AssetEntry): boolean {
    return Object.values(equipment).includes(entry.path);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Equipment Sandbox</span>
        <span style={styles.count}>{allItems.length} items</span>
      </div>

      <input
        style={styles.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search all equipment..."
      />

      <div style={styles.catTabs}>
        <button
          style={{ ...styles.catTab, ...(!catFilter ? styles.catActive : {}) }}
          onClick={() => setCatFilter("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            style={{
              ...styles.catTab,
              ...(catFilter === cat.id ? styles.catActive : {}),
            }}
            onClick={() => setCatFilter(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.thumb,
              ...(isEquipped(item) ? styles.thumbEquipped : {}),
            }}
            onClick={() => handleEquip(item)}
            title={item.id}
          >
            {thumbMap.has(item.path) ? (
              <img
                src={thumbMap.get(item.path)}
                style={styles.thumbImg}
              />
            ) : (
              <div style={styles.thumbPlaceholder}>
                {item.id.slice(0, 3)}
              </div>
            )}
            {isEquipped(item) && <div style={styles.equippedBadge}>E</div>}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>No items match your filter</div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: "1px solid var(--border)",
  },
  title: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-bright)",
  },
  count: {
    fontSize: "11px",
    color: "var(--text-dim)",
  },
  search: {
    margin: "8px 12px",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "12px",
    outline: "none",
  },
  catTabs: {
    display: "flex",
    gap: "4px",
    padding: "0 12px 8px",
    flexWrap: "wrap",
  },
  catTab: {
    padding: "3px 10px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "11px",
    cursor: "pointer",
  },
  catActive: {
    background: "var(--accent)",
    color: "#fff",
    borderColor: "var(--accent)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
    gap: "6px",
    padding: "8px 12px",
    overflowY: "auto",
    flex: 1,
  },
  thumb: {
    position: "relative" as const,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer",
    background: "var(--bg)",
    border: "2px solid transparent",
    transition: "border-color 0.15s",
  },
  thumbEquipped: {
    borderColor: "var(--accent)",
  },
  thumbImg: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    objectFit: "contain",
  },
  thumbPlaceholder: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    color: "var(--text-dim)",
  },
  equippedBadge: {
    position: "absolute" as const,
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "var(--accent)",
    color: "#fff",
    fontSize: "8px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    padding: "24px",
    textAlign: "center",
    color: "var(--text-dim)",
    fontSize: "13px",
  },
};
