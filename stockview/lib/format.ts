const price = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function formatPrice(n: number): string {
  return `$${price.format(n)}`;
}

export function formatChange(n: number): string {
  return `${n >= 0 ? "+" : "−"}$${price.format(Math.abs(n))}`;
}

export function formatPercent(n: number): string {
  return `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(2)}%`;
}

export function formatCompact(n: number | null): string {
  return n == null ? "—" : compact.format(n);
}

export function formatMarketCap(n: number | null): string {
  return n == null ? "—" : `$${compact.format(n)}`;
}
