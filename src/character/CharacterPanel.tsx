import { useEffect, useState, useMemo } from "react";
import { PaperDollView } from "./PaperDollView";
import { SlotPicker } from "./SlotPicker";
import { usePaperdollStore } from "./paperdollStore";
import { DEFAULT_LAYERS, getLayersForRace } from "../data/layers/defaultLayers";
import { RACES, getRaceById } from "../data/races/RaceDefinition";
import { useInventoryStore, getFilteredItems } from "../inventory/inventoryStore";
import { getLayerIdsForItem } from "../inventory/Inventory";
import { saveCharacter, loadAllCharacters, loadCharacter, exportCharacterJSON, importCharacterJSON } from "../save/CharacterSave";
import type { DirectionCode, AnimationState } from "./types";

const DIRECTIONS: DirectionCode[] = [
  "S", "SE", "E", "NE", "N", "NW", "W", "SW",
];

const ANIMATIONS: AnimationState[] = [
  "idle", "walk", "attack", "hit", "death", "skill", "run",
];

const ANIM_SPEEDS = [0.25, 0.5, 1, 1.5, 2];

export function CharacterPanel() {
  const config = usePaperdollStore((s) => s.config);
  const setDirection = usePaperdollStore((s) => s.setDirection);
  const setAnimation = usePaperdollStore((s) => s.setAnimation);
  const setRace = usePaperdollStore((s) => s.setRace);
  const setGender = usePaperdollStore((s) => s.setGender);
  const setBody = usePaperdollStore((s) => s.setBody);
  const setName = usePaperdollStore((s) => s.setName);
  const setLayer = usePaperdollStore((s) => s.setLayer);
  const reset = usePaperdollStore((s) => s.reset);
  const loadConfig = usePaperdollStore((s) => s.loadConfig);
  const presets = usePaperdollStore((s) => s.presets);
  const customPresets = usePaperdollStore((s) => s.customPresets);
  const loadPreset = usePaperdollStore((s) => s.loadPreset);
  const savePreset = usePaperdollStore((s) => s.savePreset);
  const deletePreset = usePaperdollStore((s) => s.deletePreset);
  const animating = usePaperdollStore((s) => s.animating);
  const animSpeed = usePaperdollStore((s) => s.animSpeed);
  const animFrame = usePaperdollStore((s) => s.animFrame);
  const setAnimating = usePaperdollStore((s) => s.setAnimating);
  const setAnimSpeed = usePaperdollStore((s) => s.setAnimSpeed);

  const [presetName, setPresetName] = useState("");
  const [charName, setCharName] = useState("");
  const [savedChars, setSavedChars] = useState<string[]>([]);
  const [invSearch, setInvSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"layers" | "inventory">("layers");

  const invItems = useInventoryStore((s) => s.items);
  const refreshInv = useInventoryStore((s) => s.refresh);

  useEffect(() => {
    refreshInv();
    setSavedChars(loadAllCharacters().map((c) => `${c.name} (${c.race})`));
  }, []);

  const currentRace = getRaceById(config.race);
  const raceLayers = currentRace
    ? getLayersForRace(config.race)
    : DEFAULT_LAYERS;

  const filteredInv = useMemo(() => {
    if (!invSearch) return invItems.slice(0, 50);
    const q = invSearch.toLowerCase();
    return invItems
      .filter(
        (i) =>
          i.assetEntry.id.toLowerCase().includes(q) ||
          i.assetEntry.path.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [invItems, invSearch]);

  const allPresets = [...presets, ...customPresets];

  function handleEquipFromInventory(itemId: string, assetPath: string) {
    const layerIds = getLayerIdsForItem({ assetEntry: { id: itemId, path: assetPath, type: "sprite" }, equipSlot: undefined });
    for (const lid of layerIds) {
      setLayer(lid, assetPath);
    }
  }

  function handleSave() {
    saveCharacter({
      race: config.race,
      gender: config.gender,
      name: charName || config.name,
      equipment: { ...config.equipment },
      appearance: { ...config.appearance },
      direction: config.direction,
      animation: config.animation,
      expression: config.expression,
      created: Date.now(),
      updated: Date.now(),
    });
    setSavedChars(loadAllCharacters().map((c) => `${c.name} (${c.race})`));
  }

  function handleLoad(nameRace: string) {
    const match = nameRace.match(/^(.+) \((.+)\)$/);
    if (!match) return;
    const c = loadCharacter(match[1], match[2]);
    if (c) {
      loadConfig({
        race: c.race,
        gender: c.gender,
        name: c.name,
        body: "",
        equipment: { ...c.equipment },
        appearance: { ...c.appearance },
        direction: c.direction,
        animation: c.animation,
        expression: c.expression,
      });
    }
  }

  function handleExport() {
    const json = exportCharacterJSON({
      race: config.race,
      gender: config.gender,
      name: charName || config.name,
      equipment: { ...config.equipment },
      appearance: { ...config.appearance },
      direction: config.direction,
      animation: config.animation,
      expression: config.expression,
      created: Date.now(),
      updated: Date.now(),
    });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${charName || config.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.layout}>
      <PaperDollView />

      {/* Animation controls */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <button style={styles.playBtn} onClick={() => setAnimating(!animating)}>
            {animating ? "⏸ Pause" : "▶ Play"}
          </button>
          <span style={styles.frameInfo}>Frame {animFrame}</span>
          <div style={styles.speedGroup}>
            {ANIM_SPEEDS.map((s) => (
              <button
                key={s}
                style={{ ...styles.btnTiny, ...(animSpeed === s ? styles.btnActive : {}) }}
                onClick={() => setAnimSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Character info */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={charName || config.name}
            onChange={(e) => { setCharName(e.target.value); setName(e.target.value); }}
            placeholder="Character name"
          />
        </div>
        <div style={styles.controlRow}>
          <label style={styles.label}>Race</label>
          <select style={styles.select} value={config.race} onChange={(e) => setRace(e.target.value)}>
            {RACES.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <label style={styles.label}>Sex</label>
          <select style={styles.select} value={config.gender} onChange={(e) => setGender(e.target.value)}>
            {currentRace?.genders.map((g) => (
              <option key={g} value={g}>{g}</option>
            )) ?? <option value="male">male</option>}
          </select>
        </div>
        <div style={styles.controlRow}>
          <label style={styles.label}>Dir</label>
          <div style={styles.btnGroup}>
            {DIRECTIONS.map((d) => (
              <button
                key={d}
                style={{ ...styles.btnSmall, ...(config.direction === d ? styles.btnActive : {}) }}
                onClick={() => setDirection(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.controlRow}>
          <label style={styles.label}>Anim</label>
          <div style={styles.btnGroup}>
            {ANIMATIONS.map((a) => (
              <button
                key={a}
                style={{ ...styles.btnSmall, ...(config.animation === a ? styles.btnActive : {}) }}
                onClick={() => setAnimation(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <label style={styles.label}>Preset</label>
          <select
            style={styles.select}
            value=""
            onChange={(e) => e.target.value && handlePresetSelect(e.target.value)}
          >
            <option value="">— Select —</option>
            {allPresets.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <input
            style={styles.inputSmall}
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="new"
          />
          <button style={styles.btnTiny} onClick={() => { if (presetName) { savePreset(presetName); setPresetName(""); }}}>
            Save
          </button>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === "layers" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("layers")}
        >
          Layers
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "inventory" ? styles.tabActive : {}) }}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </button>
      </div>

      <div style={styles.slots}>
        {activeTab === "layers" ? (
          raceLayers.map((layer) => (
            <SlotPicker key={layer.id} layerId={layer.id} layerDef={layer} />
          ))
        ) : (
          <div style={styles.invPanel}>
            <div style={styles.invHeader}>
              <span style={styles.invTitle}>All Items (Sandbox)</span>
            </div>
            <input
              style={styles.invSearch}
              value={invSearch}
              onChange={(e) => setInvSearch(e.target.value)}
              placeholder="Search all items..."
            />
            <div style={styles.invList}>
              {filteredInv.map((item) => (
                <div
                  key={item.assetEntry.id}
                  style={styles.invItem}
                  onClick={() =>
                    handleEquipFromInventory(item.assetEntry.id, item.assetEntry.path)
                  }
                >
                  <div style={styles.invItemId}>{item.assetEntry.id}</div>
                  <button
                    style={styles.equipBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquipFromInventory(item.assetEntry.id, item.assetEntry.path);
                    }}
                  >
                    Equip
                  </button>
                </div>
              ))}
              {filteredInv.length === 0 && (
                <div style={styles.empty}>No items found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save / Load / Export */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <button style={styles.btnTiny} onClick={handleSave}>Save</button>
          {savedChars.length > 0 && (
            <select
              style={styles.select}
              value=""
              onChange={(e) => e.target.value && handleLoad(e.target.value)}
            >
              <option value="">— Load —</option>
              {savedChars.map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          )}
          <button style={styles.btnTiny} onClick={handleExport}>Export</button>
          <button style={{ ...styles.btnTiny, ...styles.resetBtn }} onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );

  function handlePresetSelect(name: string) {
    const p = allPresets.find((p) => p.name === name);
    if (p) loadPreset(p);
  }
}

const styles: Record<string, React.CSSProperties> = {
  layout: { display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" },
  controls: { padding: "6px 12px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "4px" },
  controlRow: { display: "flex", alignItems: "center", gap: "6px" },
  label: { fontSize: "10px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.5px", minWidth: "24px" },
  select: { padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-bright)", fontSize: "11px" },
  input: { flex: 1, padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-bright)", fontSize: "11px", outline: "none" },
  inputSmall: { width: "60px", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-bright)", fontSize: "11px", outline: "none" },
  btnGroup: { display: "flex", gap: "2px", flexWrap: "wrap" },
  btnSmall: { padding: "2px 5px", borderRadius: "3px", border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontSize: "10px", cursor: "pointer" },
  btnTiny: { padding: "2px 6px", borderRadius: "3px", border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontSize: "10px", cursor: "pointer" },
  btnActive: { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" },
  playBtn: { padding: "3px 10px", borderRadius: "4px", border: "1px solid var(--accent)", background: "var(--accent)", color: "#fff", fontSize: "11px", fontWeight: 600, cursor: "pointer" },
  frameInfo: { fontSize: "11px", color: "var(--text-dim)", fontFamily: "monospace", minWidth: "60px" },
  speedGroup: { display: "flex", gap: "2px", marginLeft: "auto" },
  tabs: { display: "flex", borderBottom: "1px solid var(--border)" },
  tab: { flex: 1, padding: "8px", border: "none", background: "transparent", color: "var(--text-dim)", fontSize: "12px", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid transparent" },
  tabActive: { color: "var(--accent)", borderBottomColor: "var(--accent)" },
  slots: { flex: 1, overflowY: "auto" },
  resetBtn: { color: "var(--danger)", marginLeft: "auto" },
  invPanel: { padding: "8px" },
  invHeader: { marginBottom: "6px" },
  invTitle: { fontSize: "12px", fontWeight: 600, color: "var(--text-bright)" },
  invSearch: {
    width: "100%", padding: "4px 8px", borderRadius: "4px",
    border: "1px solid var(--border)", background: "var(--bg)",
    color: "var(--text-bright)", fontSize: "11px", outline: "none", marginBottom: "6px",
  },
  invList: { maxHeight: "200px", overflowY: "auto" },
  invItem: { display: "flex", alignItems: "center", gap: "6px", padding: "4px 6px", cursor: "pointer", borderRadius: "3px", fontSize: "11px" },
  invItemId: { flex: 1, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  equipBtn: { padding: "2px 8px", borderRadius: "3px", border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", fontSize: "10px", cursor: "pointer" },
  empty: { padding: "8px", textAlign: "center", color: "var(--text-dim)", fontSize: "11px" },
};
