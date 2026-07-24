import { useState } from "react";

interface AssetSearchProps {
  categoryCounts: Record<string, number>;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onSearch: (query: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  sprite: "Sprites",
  texture: "Textures",
  map: "Maps",
  item: "Items",
  palette: "Palettes",
};

export function AssetSearch({
  categoryCounts,
  selectedCategory,
  onCategoryChange,
  onSearch,
}: AssetSearchProps) {
  const [query, setQuery] = useState("");

  const categories = Object.keys(categoryCounts).sort();

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        type="text"
        placeholder="Search assets by name..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <div style={styles.filters}>
        <button
          style={{
            ...styles.filterBtn,
            ...(selectedCategory === "" ? styles.filterActive : {}),
          }}
          onClick={() => onCategoryChange("")}
        >
          All ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            style={{
              ...styles.filterBtn,
              ...(selectedCategory === cat ? styles.filterActive : {}),
            }}
            onClick={() => onCategoryChange(cat)}
          >
            {CATEGORY_LABELS[cat] ?? cat} ({categoryCounts[cat]})
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "12px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-bright)",
    fontSize: "13px",
    outline: "none",
  },
  filters: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "4px 12px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontSize: "12px",
    cursor: "pointer",
  },
  filterActive: {
    background: "var(--accent)",
    color: "#fff",
    borderColor: "var(--accent)",
  },
};
