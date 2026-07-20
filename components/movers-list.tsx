import Link from "next/link";
import type { Quote } from "@/lib/types";
import { formatPrice, formatPercent } from "@/lib/format";

export function MoversList({ title, quotes }: { title: string; quotes: Quote[] }) {
  return (
    <section aria-label={title}>
      <h3 className="text-[15px] font-medium text-ink-2">{title}</h3>
      <ul className="mt-2 divide-y divide-line">
        {quotes.map((q) => {
          const up = q.changePercent >= 0;
          return (
            <li key={q.symbol}>
              <Link
                href={`/stock/${q.symbol}`}
                className="group flex items-center gap-3 py-3 transition-colors duration-150"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold group-hover:underline group-hover:underline-offset-4">
                    {q.symbol}
                  </span>
                  <p className="truncate text-[13px] text-ink-3">{q.name}</p>
                </div>
                <span className="tnum text-sm">{formatPrice(q.price)}</span>
                <span
                  className={`tnum w-[4.5rem] text-right text-sm font-medium ${up ? "text-gain" : "text-loss"}`}
                >
                  {formatPercent(q.changePercent)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
