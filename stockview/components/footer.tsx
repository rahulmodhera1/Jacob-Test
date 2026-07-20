import { isLiveData } from "@/lib/market";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-5xl px-5 py-6 text-sm text-ink-3 sm:px-8">
        <p>
          {isLiveData
            ? "Market data is delayed and for information only — not investment advice."
            : "Showing demo data. Add a FINNHUB_API_KEY to .env.local for live quotes."}
        </p>
      </div>
    </footer>
  );
}
