import { useEffect } from "react";
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

export function CharacterPanel() {
  const config = usePaperdollStore((s) => s.config);
  const setDirection = usePaperdollStore((s) => s.setDirection);
  const setAnimation = usePaperdollStore((s) => s.setAnimation);
  const setRace = usePaperdollStore((s) => s.setRace);
  const setBody = usePaperdollStore((s) => s.setBody);
  const reset = usePaperdollStore((s) => s.reset);
  const refreshAllCandidates = usePaperdollStore((s) => s.refreshAllCandidates);

  useEffect(() => {
    refreshAllCandidates();
  }, []);

  return (
    <div style={styles.layout}>
      <PaperDollView />
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
    padding: "8px 12px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  controlRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    fontSize: "11px",
    color: "var(--text-dim)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    minWidth: "36px",
  },
  select: {
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "12px",
  },
  input: {
    flex: 1,
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "12px",
    outline: "none",
  },
  btnGroup: {
    display: "flex",
    gap: "3px",
    flexWrap: "wrap",
  },
  btnSmall: {
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
    fontSize: "12px",
    cursor: "pointer",
  },
};
