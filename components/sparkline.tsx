import type { Candle } from "@/lib/types";

type Props = {
  candles: Candle[];
  up: boolean;
  width?: number;
  height?: number;
};

/** Tiny server-rendered SVG line — no chart library needed for minis. */
export function Sparkline({ candles, up, width = 96, height = 32 }: Props) {
  if (candles.length < 2) return null;

  const values = candles.map((c) => c.c);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const color = up ? "var(--chart-gain)" : "var(--chart-loss)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
