export type IndexDef = {
  label: string;
  /** US-listed ETF proxy — free API tiers don't serve raw index quotes */
  symbol: string;
  note: string;
};

export const INDICES: IndexDef[] = [
  { label: "S&P 500", symbol: "SPY", note: "via SPY" },
  { label: "NASDAQ 100", symbol: "QQQ", note: "via QQQ" },
  { label: "Dow Jones", symbol: "DIA", note: "via DIA" },
  { label: "TSX (Canada)", symbol: "EWC", note: "via EWC" },
];

/** Watchlist used to compute the gainers / losers lists on the free tier. */
export const MOVERS_WATCHLIST = [
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "GOOGL",
  "META",
  "TSLA",
  "AMD",
  "NFLX",
  "SHOP",
  "JPM",
  "DIS",
  "COST",
  "UBER",
] as const;

export const KNOWN_NAMES: Record<string, string> = {
  SPY: "SPDR S&P 500 ETF",
  QQQ: "Invesco QQQ Trust",
  DIA: "SPDR Dow Jones Industrial Average ETF",
  EWC: "iShares MSCI Canada ETF",
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corporation",
  NVDA: "NVIDIA Corporation",
  AMZN: "Amazon.com, Inc.",
  GOOGL: "Alphabet Inc.",
  META: "Meta Platforms, Inc.",
  TSLA: "Tesla, Inc.",
  AMD: "Advanced Micro Devices, Inc.",
  NFLX: "Netflix, Inc.",
  SHOP: "Shopify Inc.",
  JPM: "JPMorgan Chase & Co.",
  DIS: "The Walt Disney Company",
  COST: "Costco Wholesale Corporation",
  UBER: "Uber Technologies, Inc.",
};
