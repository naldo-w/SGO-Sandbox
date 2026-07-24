import { useEffect, useState, useMemo, useRef } from "react";
import { Assets } from "pixi.js";
import { assetLoader } from "../assets/AssetLoader";
import type { AssetEntry } from "../assets/contract";
import type { EquipSlot, AssetReference } from "./types";
import { usePaperdollStore } from "./paperdollStore";
import { EQUIP_TO_RENDER } from "./types";

const SLOT_LABELS: Record<EquipSlot, string> = {
  body: "Body",
  face: "Face",
  hair: "Hair",
  armor: "Armor",
  weapon: "Weapon",
  accessory: "Accessory",
};

interface SlotPickerProps {
  slot: EquipSlot;
}

export function SlotPicker({ slot }: SlotPickerProps) {
  const config = usePaperdollStore((s) => s.config);
  const setLayer = usePaperdollStore((s) => s.setLayer);
  const clearLayer = usePaperdollStore((s) => s.clearLayer);
  const layerStates = usePaperdollStore((s) => s.layerStates);
  const setLayerVisibility = usePaperdollStore((s) => s.setLayerVisibility);
  const setLayerAlpha = usePaperdollStore((s) => s.setLayerAlpha);

  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<AssetEntry[]>([]);
  const [thumbUrls, setThumbUrls] = useState<Map<string, string>>(new Map());
  const thumbLoading = useRef<Set<string>>(new Set());

  const currentRef = config.layers[slot];
  const renderTargets = EQUIP_TO_RENDER[slot];
  const layerState = layerStates[slot];

  useEffect(() => {
    const idx = assetLoader.getIndex();
    if (!idx) return;
    const items = idx.assets.filter((a) => a.type === "sprite");
    setCandidates(items);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return candidates.slice(0, 30);
    const q = search.toLowerCase();
    return candidates
      .filter((a) => a.id.toLowerCase().includes(q) || a.path.toLowerCase().includes(q))
      .slice(0, 30);
  }, [candidates, search]);

  useEffect(() => {
    for (const entry of filtered) {
      if (thumbUrls.has(entry.path) || thumbLoading.current.has(entry.path)) continue;
      thumbLoading.current.add(entry.path);
      loadThumb(entry.path);
    }
  }, [filtered]);

  async function loadThumb(spritePath: string) {
    try {
      const anim = await assetLoader.loadAnimation(spritePath);
      if (!anim.frames.length) return;
      const frameFile = anim.frames[0].file;
      const base = import.meta.env.VITE_GAME_ASSET_PATH || "/GameAssets";
      const url = `${base}/${spritePath}/${frameFile}`;
      await Assets.load(url);
      setThumbUrls((prev) => new Map(prev).set(spritePath, url));
    } catch {
      // no preview
    }
  }

  function handleSelect(entry: AssetEntry) {
    const ref: AssetReference = { assetId: entry.path };
    setLayer(slot, ref);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>{SLOT_LABELS[slot]}</span>
        <span style={styles.targets}>→ {renderTargets.join(", ")}</span>
        {currentRef && (
          <button style={styles.clearBtn} onClick={() => clearLayer(slot)}>
            ✕
          </button>
        )}
      </div>

      {currentRef && (
        <div style={styles.currentRow}>
          <div style={styles.currentThumb}>
            {thumbUrls.has(currentRef.assetId) ? (
              <img
                src={thumbUrls.get(currentRef.assetId)}
                style={{ width: 32, height: 32, objectFit: "contain" }}
              />
            ) : (
              <div style={styles.thumbPlaceholder} />
            )}
          </div>
          <div style={styles.currentInfo}>
            <div style={styles.currentId}>{currentRef.assetId}</div>
            <div style={styles.currentMeta}>
              {thumbUrls.has(currentRef.assetId) ? "✓ loaded" : "loading..."}
            </div>
          </div>
        </div>
      )}

      <div style={styles.layerCtrls}>
        <label style={styles.layerLabel}>
          <input
            type="checkbox"
            checked={layerState.visible}
            onChange={(e) => setLayerVisibility(slot, e.target.checked)}
          />
          Show
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={layerState.alpha}
          onChange={(e) => setLayerAlpha(slot, parseFloat(e.target.value))}
          style={styles.alphaSlider}
        />
      </div>

      <input
        style={styles.input}
        type="text"
        placeholder={`Filter ${SLOT_LABELS[slot].toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={styles.list}>
        {filtered.map((a) => (
          <div
            key={a.id}
            style={{
              ...styles.item,
              ...(currentRef?.assetId === a.path ? styles.itemActive : {}),
            }}
            onClick={() => handleSelect(a)}
          >
            <div style={styles.itemThumb}>
              {thumbUrls.has(a.path) ? (
                <img
                  src={thumbUrls.get(a.path)}
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                />
              ) : (
                <div style={styles.thumbPlaceholderSm} />
              )}
            </div>
            <div style={styles.itemInfo}>
              <div style={styles.itemId}>{a.id}</div>
              <div style={styles.itemPath}>{a.path}</div>
            </div>
            {a.animation && <span style={styles.animBadge}>A</span>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={styles.empty}>No items found</div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    borderBottom: "1px solid var(--border)",
    padding: "8px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-bright)",
    marginBottom: "4px",
  },
  targets: {
    fontSize: "10px",
    color: "var(--text-dim)",
    fontWeight: 400,
  },
  clearBtn: {
    marginLeft: "auto",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    background: "transparent",
    color: "var(--danger)",
    cursor: "pointer",
    fontSize: "10px",
  },
  currentRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "4px",
    padding: "4px",
    background: "var(--bg)",
    borderRadius: "4px",
  },
  currentThumb: {
    width: 32,
    height: 32,
    borderRadius: "3px",
    overflow: "hidden",
    flexShrink: 0,
    background: "var(--bg-panel)",
  },
  thumbPlaceholder: {
    width: 32,
    height: 32,
    background: "var(--bg-panel)",
    borderRadius: "3px",
  },
  thumbPlaceholderSm: {
    width: 24,
    height: 24,
    background: "var(--bg-panel)",
    borderRadius: "2px",
  },
  currentInfo: {
    flex: 1,
    minWidth: 0,
  },
  currentId: {
    fontSize: "11px",
    color: "var(--accent)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  currentMeta: {
    fontSize: "10px",
    color: "var(--text-dim)",
  },
  layerCtrls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
    fontSize: "11px",
  },
  layerLabel: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    color: "var(--text-dim)",
  },
  alphaSlider: {
    flex: 1,
    height: "3px",
    cursor: "pointer",
    accentColor: "var(--accent)",
  },
  input: {
    width: "100%",
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "11px",
    outline: "none",
    marginBottom: "4px",
  },
  list: {
    maxHeight: "100px",
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "3px 6px",
    cursor: "pointer",
    borderRadius: "3px",
    fontSize: "11px",
  },
  itemActive: {
    background: "var(--bg-hover)",
  },
  itemThumb: {
    width: 24,
    height: 24,
    borderRadius: "2px",
    overflow: "hidden",
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemId: {
    color: "var(--text)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemPath: {
    fontSize: "10px",
    color: "var(--text-dim)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  animBadge: {
    fontSize: "9px",
    color: "var(--success)",
    fontWeight: 700,
    flexShrink: 0,
  },
  empty: {
    padding: "8px",
    textAlign: "center",
    color: "var(--text-dim)",
    fontSize: "11px",
  },
};
