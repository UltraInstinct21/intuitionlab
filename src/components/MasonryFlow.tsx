import React, { useLayoutEffect, useRef, useState } from 'react';

const GAP = 24;
const TWO_COL_MIN_WIDTH = 768;

interface MasonryFlowProps {
  children: React.ReactNode;
  resetKey?: string | number;
}

// ponytail: CSS can't pack row-major without gaps, so measure + stack each
// box into the shortest column. Order in = reading order out. No deps.
export const MasonryFlow: React.FC<MasonryFlowProps> = ({ children, resetKey }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [layout, setLayout] = useState<{ x: number; y: number; w: number }[]>([]);
  const [height, setHeight] = useState<number>(0);

  const items = React.Children.toArray(children);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const cw = container.clientWidth;
      if (cw === 0) return;
      const cols = cw >= TWO_COL_MIN_WIDTH ? 2 : 1;
      const w = (cw - GAP * (cols - 1)) / cols;
      const colH = new Array<number>(cols).fill(0);
      const pos = items.map((_, i) => {
        const h = itemRefs.current[i]?.offsetHeight ?? 0;
        let c = 0;
        for (let k = 1; k < cols; k++) if (colH[k] < colH[c]) c = k;
        const p = { x: c * (w + GAP), y: colH[c], w };
        if (h > 0) colH[c] += h + GAP;
        return p;
      });
      setLayout((prev) =>
        prev.length === pos.length &&
        prev.every((p, i) => p.x === pos[i].x && p.y === pos[i].y && p.w === pos[i].w)
          ? prev
          : pos
      );
      const nextH = Math.max(0, Math.max(0, ...colH) - GAP);
      setHeight((prev) => (prev === nextH ? prev : nextH));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(container);
    itemRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, items.length]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      {items.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          style={
            layout[i]
              ? { position: 'absolute', left: layout[i].x, top: layout[i].y, width: layout[i].w }
              : { position: 'absolute', left: 0, top: 0, width: '100%', visibility: 'hidden' }
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
};
