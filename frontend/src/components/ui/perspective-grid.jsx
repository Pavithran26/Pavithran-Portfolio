import { useMemo } from "react";

/**
 * PerspectiveGrid: lightweight perspective floor made from CSS grid tiles.
 * Kept dependency-free so it works with this portfolio's Vite setup.
 */
export function PerspectiveGrid({ rows = 20, cols = 20, className = "" }) {
  const tiles = useMemo(() => Array.from({ length: rows * cols }, (_, i) => i), [rows, cols]);

  return (
    <div className={`perspective-grid-root ${className}`} aria-hidden="true">
      <div
        className="perspective-grid-plane"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {tiles.map((tile) => <span className="perspective-grid-tile" key={tile} />)}
      </div>
      <div className="perspective-grid-fade" />
    </div>
  );
}

export default PerspectiveGrid;
