import "server-only";

import type { Candle, Quote, Range, SearchResult } from "./types";
import { demoHistory, demoQuote, demoSearch } from "./demo";
import { KNOWN_NAMES } from "./symbols";

/**
 * Server-side data layer. API keys are read from the environment here and
 * never reach the client.
 *
 * - FINNHUB_API_KEY     → live quotes, symbol search, market cap
 * - TWELVEDATA_API_KEY  → real historical series for charts + volume
 *
 * Missing keys (or any provider error) fall back to deterministic demo data
 * so the app always renders.
 */

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
const TWELVEDATA_KEY = process.env.TWELVEDATA_API_KEY;

export const isLiveData = Boolean(FINNHUB_KEY);

async function finnhub<T>(path: string, revalidate: number): Promise<T> {
  const url = `https://finnhub.io/api/v1/${path}${path.includes("?") ? "&" : "?"}token=${FINNHUB_KEY}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`Finnhub ${res.status}`);
  return res.json();
}

async function twelvedata<T>(path: string, revalidate: number): Promise<T> {
  const url = `https://api.twelvedata.com/${path}&apikey=${TWELVEDATA_KEY}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`Twelve Data ${res.status}`);
  const json = await res.json();
  if (json.status === "error") throw new Error(json.message ?? "Twelve Data error");
  return json;
}

type FinnhubQuote = { c: number; d: number; dp: number; h: number; l: number; o: number; pc: number };
type FinnhubProfile = { name?: string; marketCapitalization?: number };

export async function getQuote(symbol: string): Promise<Quote> {
  if (!FINNHUB_KEY) return demoQuote(symbol);
  try {
    const [q, profile] = await Promise.all([
      finnhub<FinnhubQuote>(`quote?symbol=${encodeURIComponent(symbol)}`, 60),
      finnhub<FinnhubProfile>(`stock/profile2?symbol=${encodeURIComponent(symbol)}`, 86400).catch(
        () => ({}) as FinnhubProfile,
      ),
    ]);
    if (!q || q.c === 0) throw new Error("empty quote");
    return {
      symbol,
      name: profile.name || KNOWN_NAMES[symbol] || symbol,
      price: q.c,
      change: q.d,
      changePercent: q.dp,
      open: q.o,
      high: q.h,
      low: q.l,
      prevClose: q.pc,
      volume: await getVolume(symbol),
      // Finnhub reports market cap in millions of USD
      marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1_000_000 : null,
    };
  } catch {
    return demoQuote(symbol);
  }
}

async function getVolume(symbol: string): Promise<number | null> {
  if (!TWELVEDATA_KEY) return null;
  try {
    const q = await twelvedata<{ volume?: string }>(`quote?symbol=${encodeURIComponent(symbol)}`, 300);
    return q.volume ? Number(q.volume) : null;
  } catch {
    return null;
  }
}

export async function getQuotes(symbols: readonly string[]): Promise<Quote[]> {
  return Promise.all(symbols.map((s) => getQuote(s)));
}

const RANGE_PARAMS: Record<Range, { interval: string; outputsize: number; revalidate: number }> = {
  "1D": { interval: "5min", outputsize: 78, revalidate: 300 },
  "1W": { interval: "30min", outputsize: 65, revalidate: 900 },
  "1M": { interval: "1day", outputsize: 22, revalidate: 3600 },
  "1Y": { interval: "1day", outputsize: 252, revalidate: 3600 },
  ALL: { interval: "1week", outputsize: 500, revalidate: 86400 },
};

type TwelveDataSeries = { values?: { datetime: string; close: string }[] };

export async function getHistory(symbol: string, range: Range): Promise<Candle[]> {
  if (!TWELVEDATA_KEY) return demoHistory(symbol, range);
  try {
    const { interval, outputsize, revalidate } = RANGE_PARAMS[range];
    const data = await twelvedata<TwelveDataSeries>(
      `time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}`,
      revalidate,
    );
    if (!data.values?.length) throw new Error("empty series");
    return data.values
      .map((v) => ({ t: Math.floor(new Date(v.datetime.replace(" ", "T")).getTime() / 1000), c: Number(v.close) }))
      .filter((c) => Number.isFinite(c.c))
      .reverse();
  } catch {
    return demoHistory(symbol, range);
  }
}

type FinnhubSearch = { result?: { symbol: string; description: string; type: string }[] };

export async function searchSymbols(query: string): Promise<SearchResult[]> {
  if (!FINNHUB_KEY) return demoSearch(query);
  try {
    const data = await finnhub<FinnhubSearch>(`search?q=${encodeURIComponent(query)}`, 3600);
    return (data.result ?? [])
      .filter((r) => r.type === "Common Stock" || r.type === "ETP")
      .filter((r) => !r.symbol.includes(".") && !r.symbol.includes(":"))
      .slice(0, 8)
      .map((r) => ({ symbol: r.symbol, name: r.description }));
  } catch {
    return demoSearch(query);
  }
}
