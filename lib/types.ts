export type Quote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number | null;
  marketCap: number | null;
};

export type Candle = {
  /** Unix timestamp in seconds */
  t: number;
  /** Close price */
  c: number;
};

export const RANGES = ["1D", "1W", "1M", "1Y", "ALL"] as const;
export type Range = (typeof RANGES)[number];

export type SearchResult = {
  symbol: string;
  name: string;
};
