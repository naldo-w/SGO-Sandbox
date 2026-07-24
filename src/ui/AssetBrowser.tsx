import { useState, useEffect, useMemo } from "react";
import type { AssetEntry } from "../assets/contract";
import { assetLoader } from "../assets/AssetLoader";
import { AssetSearch } from "./AssetSearch";
import { AssetPreview } from "./AssetPreview";

export function AssetBrowser() {
  const [assets, setAssets] = useState<AssetEntry[]>([]);
  const [selected, setSelected] = useState<AssetEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const idx = assetLoader.getIndex();
    if (idx) {
      setAssets(idx.assets);
    }
  }, []);

  const filtered = useMemo(() => {
    let result = assets;
    if (selectedCategory) {
      result = result.filter((a) => a.type === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.path.toLowerCase().includes(q)
      );
    }
    return result.slice(0, 200);
  }, [assets, selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of assets) {
      counts[a.type] = (counts[a.type] || 0) + 1;
    }
    return counts;
  }, [assets]);

  return (
    <div style={styles.layout}>
      <div style={styles.sidebar}>
        <AssetSearch
          categoryCounts={categoryCounts}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearch={setSearchQuery}
        />
        <div style={styles.list}>
          {filtered.map((a) => (
            <div
              key={a.id}
              style={{
                ...styles.item,
                ...(selected?.id === a.id ? styles.itemSelected : {}),
              }}
              onClick={() => setSelected(a)}
            >
              <div style={styles.itemName}>{a.id}</div>
              <div style={styles.itemMeta}>
                {a.type}
                {a.animation ? " · animated" : ""}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={styles.empty}>
              {searchQuery
                ? `No assets matching "${searchQuery}"`
                : "No assets loaded"}
            </div>
          )}
        </div>
      </div>
      <AssetPreview asset={selected} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebar: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid var(--border)",
    background: "var(--bg-panel)",
  },
  list: {
    flex: 1,
    overflowY: "auto",
    padding: "4px 0",
  },
  item: {
    padding: "8px 12px",
    cursor: "pointer",
    borderBottom: "1px solid transparent",
  },
  itemSelected: {
    background: "var(--bg-hover)",
    borderBottom: "1px solid var(--border)",
  },
  itemName: {
    color: "var(--text-bright)",
    fontSize: "13px",
    fontWeight: 500,
  },
  itemMeta: {
    color: "var(--text-dim)",
    fontSize: "11px",
    marginTop: "2px",
  },
  empty: {
    padding: "24px",
    textAlign: "center",
    color: "var(--text-dim)",
    fontSize: "13px",
  },
};
