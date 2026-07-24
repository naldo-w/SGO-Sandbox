import { useState } from "react";

const CATEGORIES = [
  { key: "", label: "All" },
  { key: "sprite", label: "Sprites" },
];

interface AssetSearchProps {
  categoryCounts: Record<string, number>;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onSearch: (query: string) => void;
}

export function AssetSearch({
  categoryCounts,
  selectedCategory,
  onCategoryChange,
  onSearch,
}: AssetSearchProps) {
  const [query, setQuery] = useState("");

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
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            style={{
              ...styles.filterBtn,
              ...(selectedCategory === c.key ? styles.filterActive : {}),
            }}
            onClick={() => onCategoryChange(c.key)}
          >
            {c.label}
            {c.key && categoryCounts[c.key] !== undefined
              ? ` (${categoryCounts[c.key]})`
              : ""}
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
