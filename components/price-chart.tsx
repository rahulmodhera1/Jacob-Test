"use client";

import { useMemo, useRef, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import type { Candle, Range } from "@/lib/types";
import { RANGES } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  symbol: string;
  initialRange: Range;
  initialCandles: Candle[];
};

function formatTick(t: number, range: Range): string {
  const d = new Date(t * 1000);
  if (range === "1D") return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (range === "1W")
    return d.toLocaleDateString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
  if (range === "1M") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function PriceChart({ symbol, initialRange, initialCandles }: Props) {
  const [range, setRange] = useState<Range>(initialRange);
  const [candles, setCandles] = useState<Candle[]>(initialCandles);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const cacheRef = useRef(new Map<Range, Candle[]>([[initialRange, initialCandles]]));
  const requestRef = useRef(0);

  function selectRange(next: Range) {
    setRange(next);
    const cached = cacheRef.current.get(next);
    if (cached) {
      setCandles(cached);
      setLoading(false);
      setFailed(false);
      return;
    }
    const id = ++requestRef.current;
    setLoading(true);
    setFailed(false);
    fetch(`/api/history?symbol=${encodeURIComponent(symbol)}&range=${next}`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data: Candle[]) => {
        cacheRef.current.set(next, data);
        if (requestRef.current !== id) return;
        setCandles(data);
        setLoading(false);
      })
      .catch(() => {
        if (requestRef.current !== id) return;
        setFailed(true);
        setLoading(false);
      });
  }

  const up = candles.length > 1 && candles[candles.length - 1].c >= candles[0].c;
  const color = up ? "var(--chart-gain)" : "var(--chart-loss)";
  const [min, max] = useMemo(() => {
    if (candles.length === 0) return [0, 1];
    const values = candles.map((c) => c.c);
    return [Math.min(...values), Math.max(...values)];
  }, [candles]);

  return (
    <div>
      <div className="relative h-64 sm:h-80" aria-label={`${symbol} price chart, ${range}`}>
        {loading && <div className="skeleton absolute inset-0" aria-label="Loading chart" />}
        {failed && !loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-line text-sm text-ink-3">
            Couldn&rsquo;t load this range. Try another.
          </div>
        )}
        {!loading && !failed && candles.length > 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={candles} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={[min, max]} hide />
              <Tooltip
                cursor={{ stroke: "var(--line-2)", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const p = payload[0].payload as Candle;
                  return (
                    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-sm">
                      <div className="tnum font-semibold">{formatPrice(p.c)}</div>
                      <div className="mt-0.5 text-xs text-ink-3">{formatTick(p.t, range)}</div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="c"
                stroke={color}
                strokeWidth={1.75}
                fill="url(#fill)"
                animationDuration={350}
                animationEasing="ease-out"
                activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Chart range"
        className="mt-4 inline-flex rounded-full border border-line bg-surface p-1"
      >
        {RANGES.map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={range === r}
            onClick={() => selectRange(r)}
            className={`pressable rounded-full px-3.5 py-2.5 text-[13px] font-medium sm:py-1.5 ${
              range === r ? "bg-ink text-bg" : "text-ink-2 hover:text-ink"
            }`}
          >
            {r === "ALL" ? "All" : r}
          </button>
        ))}
      </div>
    </div>
  );
}
