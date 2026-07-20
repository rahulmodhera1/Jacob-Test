import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHistory, getQuote } from "@/lib/market";
import { formatChange, formatCompact, formatMarketCap, formatPercent, formatPrice } from "@/lib/format";
import { PriceChart } from "@/components/price-chart";

export const revalidate = 60;

type Props = { params: Promise<{ symbol: string }> };

const SYMBOL_RE = /^[A-Za-z0-9.\-]{1,12}$/;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  return { title: symbol.toUpperCase() };
}

export default async function StockPage({ params }: Props) {
  const raw = decodeURIComponent((await params).symbol);
  if (!SYMBOL_RE.test(raw)) notFound();
  const symbol = raw.toUpperCase();

  const [quote, candles] = await Promise.all([getQuote(symbol), getHistory(symbol, "1D")]);
  const up = quote.changePercent >= 0;

  const stats: [string, string][] = [
    ["Open", formatPrice(quote.open)],
    ["High", formatPrice(quote.high)],
    ["Low", formatPrice(quote.low)],
    ["Prev close", formatPrice(quote.prevClose)],
    ["Volume", formatCompact(quote.volume)],
    ["Market cap", formatMarketCap(quote.marketCap)],
  ];

  return (
    <div className="rise">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-2 transition-colors duration-150 hover:text-ink"
      >
        <svg
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Markets
      </Link>

      <header className="mt-5">
        <p className="text-sm font-medium text-ink-3">{symbol}</p>
        <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">{quote.name}</h1>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="tnum text-4xl font-semibold tracking-tight">{formatPrice(quote.price)}</span>
          <span className={`tnum text-[15px] font-medium ${up ? "text-gain" : "text-loss"}`}>
            {formatChange(quote.change)} ({formatPercent(quote.changePercent)}) today
          </span>
        </div>
      </header>

      <div className="mt-8">
        <PriceChart symbol={symbol} initialRange="1D" initialCandles={candles} />
      </div>

      <section className="mt-10" aria-label="Key stats">
        <h2 className="text-[15px] font-medium text-ink-2">Key stats</h2>
        <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="bg-surface px-4 py-3.5">
              <dt className="text-[13px] text-ink-3">{label}</dt>
              <dd className="tnum mt-0.5 text-[15px] font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
