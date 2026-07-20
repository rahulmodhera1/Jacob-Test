import type { Candle, Quote, Range, SearchResult } from "./types";
import { KNOWN_NAMES } from "./symbols";

/**
 * Deterministic demo data, used when no API key is configured (or a provider
 * request fails). Everything is seeded by symbol so quotes, sparklines and
 * charts stay consistent with each other across renders.
 */

const BASE_PRICES: Record<string, number> = {
  SPY: 618.4,
  QQQ: 552.1,
  DIA: 447.8,
  EWC: 44.6,
  AAPL: 231.5,
  MSFT: 452.3,
  NVDA: 172.4,
  AMZN: 224.9,
  GOOGL: 186.2,
  META: 712.6,
  TSLA: 318.7,
  AMD: 158.3,
  NFLX: 1241.5,
  SHOP: 118.9,
  JPM: 289.4,
  DIS: 122.7,
  COST: 984.2,
  UBER: 92.8,
};

function hashCode(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function basePrice(symbol: string): number {
  return BASE_PRICES[symbol] ?? 20 + (hashCode(symbol) % 4000) / 10;
}

/** Random walk ending exactly at the symbol's current demo price. */
function walk(symbol: string, points: number, spanSeconds: number, volatility: number): Candle[] {
  const rand = mulberry32(hashCode(symbol + spanSeconds));
  const end = basePrice(symbol);
  const now = Math.floor(Date.now() / 1000);
  const step = spanSeconds / (points - 1);

  const deltas: number[] = [];
  for (let i = 0; i < points - 1; i++) {
    // Slight drift plus noise; scaled to price so cheap and expensive symbols behave alike
    deltas.push((rand() - 0.48) * volatility * end);
  }
  let price = end - deltas.reduce((a, b) => a + b, 0);

  const candles: Candle[] = [{ t: now - spanSeconds, c: round2(price) }];
  for (let i = 0; i < deltas.length; i++) {
    price += deltas[i];
    candles.push({ t: Math.round(now - spanSeconds + (i + 1) * step), c: round2(price) });
  }
  candles[candles.length - 1].c = round2(end);
  return candles;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const RANGE_CONFIG: Record<Range, { points: number; span: number; volatility: number }> = {
  "1D": { points: 78, span: 6.5 * 3600, volatility: 0.0012 },
  "1W": { points: 65, span: 5 * 24 * 3600, volatility: 0.003 },
  "1M": { points: 22, span: 30 * 24 * 3600, volatility: 0.009 },
  "1Y": { points: 252, span: 365 * 24 * 3600, volatility: 0.011 },
  ALL: { points: 260, span: 5 * 365 * 24 * 3600, volatility: 0.02 },
};

export function demoHistory(symbol: string, range: Range): Candle[] {
  const { points, span, volatility } = RANGE_CONFIG[range];
  return walk(symbol, points, span, volatility);
}

export function demoQuote(symbol: string): Quote {
  const day = demoHistory(symbol, "1D");
  const price = day[day.length - 1].c;
  const rand = mulberry32(hashCode(symbol + "quote"));
  const prevClose = round2(day[0].c * (1 + (rand() - 0.5) * 0.004));
  const closes = day.map((c) => c.c);
  return {
    symbol,
    name: KNOWN_NAMES[symbol] ?? `${symbol} (demo)`,
    price,
    change: round2(price - prevClose),
    changePercent: round2(((price - prevClose) / prevClose) * 100 * 100) / 100,
    open: day[0].c,
    high: round2(Math.max(...closes)),
    low: round2(Math.min(...closes)),
    prevClose,
    volume: Math.round(5_000_000 + rand() * 60_000_000),
    marketCap: KNOWN_NAMES[symbol] ? Math.round(price * (500_000_000 + rand() * 4_000_000_000)) : null,
  };
}

export function demoSearch(query: string): SearchResult[] {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  return Object.entries(KNOWN_NAMES)
    .filter(([symbol, name]) => symbol.startsWith(q) || name.toUpperCase().includes(q))
    .slice(0, 8)
    .map(([symbol, name]) => ({ symbol, name }));
}
