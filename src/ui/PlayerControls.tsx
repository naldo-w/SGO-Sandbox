import type { Animation, DirectionEntry } from "../assets/contract";

interface PlayerControlsProps {
  animation: Animation | null;
  currentFrame: number;
  isPlaying: boolean;
  speed: number;
  totalFrames: number;
  selectedDirection: string;
  directions: Record<string, DirectionEntry> | null;
  onTogglePlay: () => void;
  onPrevFrame: () => void;
  onNextFrame: () => void;
  onSetFrame: (frame: number) => void;
  onSpeedChange: (speed: number) => void;
  onDirectionChange: (dir: string) => void;
}

const SPEEDS = [0.25, 0.5, 1, 2];

export function PlayerControls({
  animation,
  currentFrame,
  isPlaying,
  speed,
  totalFrames,
  selectedDirection,
  directions,
  onTogglePlay,
  onPrevFrame,
  onNextFrame,
  onSetFrame,
  onSpeedChange,
  onDirectionChange,
}: PlayerControlsProps) {
  if (!animation) return null;

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <button
          style={styles.btn}
          onClick={onTogglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button style={styles.btn} onClick={onPrevFrame} title="Previous frame">
          ⏮
        </button>
        <span style={styles.frameInfo}>
          {currentFrame + 1}/{totalFrames}
        </span>
        <button style={styles.btn} onClick={onNextFrame} title="Next frame">
          ⏭
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(totalFrames - 1, 0)}
        value={currentFrame}
        onChange={(e) => onSetFrame(Number(e.target.value))}
        style={styles.slider}
      />

      <div style={styles.row}>
        <div style={styles.rowLabel}>
          <span style={styles.label}>Speed</span>
          <div style={styles.btnGroup}>
            {SPEEDS.map((s) => (
              <button
                key={s}
                style={{
                  ...styles.btnSmall,
                  ...(speed === s ? styles.btnSmallActive : {}),
                }}
                onClick={() => onSpeedChange(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {directions && Object.keys(directions).length > 0 && (
        <div style={styles.row}>
          <div style={styles.rowLabel}>
            <span style={styles.label}>Direction</span>
            <div style={styles.btnGroup}>
              {Object.keys(directions).map((d) => (
                <button
                  key={d}
                  style={{
                    ...styles.btnSmall,
                    ...(selectedDirection === d ? styles.btnSmallActive : {}),
                  }}
                  onClick={() => onDirectionChange(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "8px 12px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "var(--bg-panel)",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  rowLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
  },
  label: {
    fontSize: "11px",
    color: "var(--text-dim)",
    minWidth: "48px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  btn: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    background: "transparent",
    color: "var(--text-bright)",
    cursor: "pointer",
    fontSize: "14px",
  },
  btnGroup: {
    display: "flex",
    gap: "4px",
  },
  btnSmall: {
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "11px",
    cursor: "pointer",
  },
  btnSmallActive: {
    background: "var(--accent)",
    color: "#fff",
    borderColor: "var(--accent)",
  },
  frameInfo: {
    fontSize: "12px",
    color: "var(--text)",
    minWidth: "60px",
    textAlign: "center",
    fontFamily: "monospace",
  },
  slider: {
    flex: 1,
    height: "4px",
    cursor: "pointer",
    accentColor: "var(--accent)",
  },
};
