import { Suspense } from "react";
import { getHistory, getQuote, getQuotes } from "@/lib/market";
import { INDICES, MOVERS_WATCHLIST } from "@/lib/symbols";
import { IndexCard } from "@/components/index-card";
import { MoversList } from "@/components/movers-list";
import { IndexCardSkeleton, MoversSkeleton } from "@/components/skeletons";

export const revalidate = 60;

async function Indices() {
  const cards = await Promise.all(
    INDICES.map(async (idx) => {
      const [quote, candles] = await Promise.all([getQuote(idx.symbol), getHistory(idx.symbol, "1D")]);
      return { ...idx, quote, candles };
    }),
  );
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <IndexCard key={c.symbol} label={c.label} note={c.note} quote={c.quote} candles={c.candles} />
      ))}
    </div>
  );
}

async function Movers() {
  const quotes = await getQuotes(MOVERS_WATCHLIST);
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sorted.filter((q) => q.changePercent >= 0).slice(0, 5);
  const losers = sorted.filter((q) => q.changePercent < 0).slice(-5).reverse();
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
      <MoversList title="Top gainers" quotes={gainers} />
      <MoversList title="Top losers" quotes={losers} />
    </div>
  );
}

export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-12">
      <section className="rise">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Markets</h1>
        <p className="mt-1.5 text-[15px] text-ink-2">{today}</p>
        <div className="mt-6">
          <Suspense fallback={<IndexCardSkeleton />}>
            <Indices />
          </Suspense>
        </div>
      </section>

      <section className="rise" style={{ animationDelay: "60ms" }}>
        <h2 className="text-xl font-semibold tracking-tight">Trending today</h2>
        <div className="mt-4">
          <Suspense fallback={<MoversSkeleton />}>
            <Movers />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
