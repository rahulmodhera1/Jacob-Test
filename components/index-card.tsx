import Link from "next/link";
import type { Candle, Quote } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ChangeBadge } from "./change-badge";
import { Sparkline } from "./sparkline";

type Props = {
  label: string;
  note: string;
  quote: Quote;
  candles: Candle[];
};

export function IndexCard({ label, note, quote, candles }: Props) {
  const up = quote.changePercent >= 0;
  return (
    <Link href={`/stock/${quote.symbol}`} className="card block p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-medium">{label}</h3>
          <p className="mt-0.5 text-xs text-ink-3">{note}</p>
        </div>
        <Sparkline candles={candles} up={up} />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className="tnum text-xl font-semibold tracking-tight">{formatPrice(quote.price)}</span>
        <ChangeBadge value={quote.changePercent} />
      </div>
    </Link>
  );
}
