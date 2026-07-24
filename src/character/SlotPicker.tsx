import { useEffect, useState, useMemo } from "react";
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

  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<AssetEntry[]>([]);

  const currentRef = config.layers[slot];
  const renderTargets = EQUIP_TO_RENDER[slot];

  useEffect(() => {
    const idx = assetLoader.getIndex();
    if (!idx) return;
    const items = idx.assets.filter((a) => a.type === "sprite");
    setCandidates(items);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return candidates.slice(0, 50);
    const q = search.toLowerCase();
    return candidates
      .filter((a) => a.id.toLowerCase().includes(q) || a.path.toLowerCase().includes(q))
      .slice(0, 50);
  }, [candidates, search]);

  function handleSelect(entry: AssetEntry) {
    const ref: AssetReference = { assetId: entry.path };
    setLayer(slot, ref);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>{SLOT_LABELS[slot]}</span>
        <span style={styles.targets}>
          → {renderTargets.join(", ")}
        </span>
        {currentRef && (
          <button style={styles.clearBtn} onClick={() => clearLayer(slot)}>
            ✕
          </button>
        )}
      </div>
      {currentRef && (
        <div style={styles.current}>{currentRef.assetId}</div>
      )}
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
            <div style={styles.itemId}>{a.id}</div>
            <div style={styles.itemPath}>{a.path}</div>
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
  current: {
    fontSize: "11px",
    color: "var(--accent)",
    marginBottom: "4px",
    padding: "2px 6px",
    background: "var(--bg)",
    borderRadius: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
    maxHeight: "120px",
    overflowY: "auto",
  },
  item: {
    padding: "3px 6px",
    cursor: "pointer",
    borderRadius: "3px",
    fontSize: "11px",
  },
  itemActive: {
    background: "var(--bg-hover)",
    color: "var(--accent)",
  },
  itemId: {
    color: "var(--text)",
  },
  itemPath: {
    fontSize: "10px",
    color: "var(--text-dim)",
  },
  empty: {
    padding: "8px",
    textAlign: "center",
    color: "var(--text-dim)",
    fontSize: "11px",
  },
};
