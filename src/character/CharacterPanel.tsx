import { useEffect, useState } from "react";
import { PaperDollView } from "./PaperDollView";
import { SlotPicker } from "./SlotPicker";
import { usePaperdollStore } from "./paperdollStore";
import { EQUIP_SLOTS } from "./types";
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
  const setBody = usePaperdollStore((s) => s.setBody);
  const reset = usePaperdollStore((s) => s.reset);
  const refreshAllCandidates = usePaperdollStore((s) => s.refreshAllCandidates);
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

  useEffect(() => {
    refreshAllCandidates();
  }, []);

  const allPresets = [...presets, ...customPresets];

  function handlePresetSelect(name: string) {
    const p = allPresets.find((p) => p.name === name);
    if (p) loadPreset(p);
  }

  return (
    <div style={styles.layout}>
      <PaperDollView />

      {/* Animation controls */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <button
            style={styles.playBtn}
            onClick={() => setAnimating(!animating)}
          >
            {animating ? "⏸ Pause" : "▶ Play"}
          </button>
          <span style={styles.frameInfo}>Frame {animFrame}</span>
          <div style={styles.speedGroup}>
            {ANIM_SPEEDS.map((s) => (
              <button
                key={s}
                style={{
                  ...styles.btnTiny,
                  ...(animSpeed === s ? styles.btnActive : {}),
                }}
                onClick={() => setAnimSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Race / Body / Dir / Anim */}
      <div style={styles.controls}>
        <div style={styles.controlRow}>
          <label style={styles.label}>Race</label>
          <select
            style={styles.select}
            value={config.race}
            onChange={(e) => setRace(e.target.value)}
          >
            <option value="human">Human</option>
            <option value="elf">Elf</option>
            <option value="dwarf">Dwarf</option>
          </select>
        </div>
        <div style={styles.controlRow}>
          <label style={styles.label}>Body</label>
          <input
            style={styles.input}
            value={config.body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="e.g. Item/IT00_BODY"
          />
        </div>
        <div style={styles.controlRow}>
          <label style={styles.label}>Dir</label>
          <div style={styles.btnGroup}>
            {DIRECTIONS.map((d) => (
              <button
                key={d}
                style={{
                  ...styles.btnSmall,
                  ...(config.direction === d ? styles.btnActive : {}),
                }}
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
                style={{
                  ...styles.btnSmall,
                  ...(config.animation === a ? styles.btnActive : {}),
                }}
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
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            style={styles.inputSmall}
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="new preset"
          />
          <button
            style={styles.btnTiny}
            onClick={() => {
              if (presetName) {
                savePreset(presetName);
                setPresetName("");
              }
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Slot pickers */}
      <div style={styles.slots}>
        {EQUIP_SLOTS.map((slot) => (
          <SlotPicker key={slot} slot={slot} />
        ))}
      </div>

      <button style={styles.resetBtn} onClick={reset}>
        Reset Character
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  controls: {
    padding: "6px 12px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  controlRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  label: {
    fontSize: "10px",
    color: "var(--text-dim)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    minWidth: "32px",
  },
  select: {
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "11px",
  },
  input: {
    flex: 1,
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "11px",
    outline: "none",
  },
  inputSmall: {
    width: "80px",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "11px",
    outline: "none",
  },
  btnGroup: {
    display: "flex",
    gap: "2px",
    flexWrap: "wrap",
  },
  btnSmall: {
    padding: "2px 5px",
    borderRadius: "3px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "10px",
    cursor: "pointer",
  },
  btnTiny: {
    padding: "2px 6px",
    borderRadius: "3px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "10px",
    cursor: "pointer",
  },
  btnActive: {
    background: "var(--accent)",
    color: "#fff",
    borderColor: "var(--accent)",
  },
  playBtn: {
    padding: "3px 10px",
    borderRadius: "4px",
    border: "1px solid var(--accent)",
    background: "var(--accent)",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
  },
  frameInfo: {
    fontSize: "11px",
    color: "var(--text-dim)",
    fontFamily: "monospace",
    minWidth: "60px",
  },
  speedGroup: {
    display: "flex",
    gap: "2px",
    marginLeft: "auto",
  },
  slots: {
    flex: 1,
    overflowY: "auto",
  },
  resetBtn: {
    margin: "8px",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--danger)",
    fontSize: "11px",
    cursor: "pointer",
  },
};
