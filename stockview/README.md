# Stockview

A calm, simple stock market viewer built with Next.js (App Router, TypeScript, Tailwind CSS v4) and Recharts. Warm-neutral fintech aesthetic: generous whitespace, soft light and dark themes, understated motion.

## Features

- **Market overview** — S&P 500, NASDAQ, Dow, and TSX summary cards with price, daily change, and a mini sparkline (index cards use US-listed ETF proxies — SPY, QQQ, DIA, EWC — because free API tiers don't serve raw index quotes)
- **Trending** — top gainers and losers computed from a popular-stocks watchlist
- **Stock detail** (`/stock/[symbol]`) — price, daily change, interactive chart with 1D / 1W / 1M / 1Y / All ranges, and key stats (open, high, low, prev close, volume, market cap)
- **Search** — ticker autocomplete with keyboard navigation
- **Light / dark mode** — warm and soft in both themes, saved to `localStorage`, no flash on load
- Loading skeletons, error and not-found states throughout

## Data & API keys

API keys are read **server-side only** (route handlers and server components) and never shipped to the client. Both keys are optional — without them the app renders deterministic demo data so you can develop and deploy immediately.

| Env var | Provider | Enables |
| --- | --- | --- |
| `FINNHUB_API_KEY` | [Finnhub](https://finnhub.io) (free: 60 req/min) | Live quotes, symbol search, market cap |
| `TWELVEDATA_API_KEY` | [Twelve Data](https://twelvedata.com) (free: 8 req/min, 800/day) | Real historical chart series, volume |

Responses are cached with `fetch` revalidation to stay well inside free-tier limits: quotes 60s, intraday series 5–15 min, daily/weekly series 1–24 h, company profiles 24 h.

## Local development

```bash
npm install
cp .env.example .env.local   # optional: add your keys
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the repo. If the app lives in a subdirectory, set **Root Directory** to `stockview`.
3. Framework preset: **Next.js** (auto-detected). No build settings to change.
4. Under **Settings → Environment Variables**, add `FINNHUB_API_KEY` (and optionally `TWELVEDATA_API_KEY`) for Production and Preview.
5. Deploy. Subsequent pushes to the default branch redeploy automatically.

Or from the CLI:

```bash
npm i -g vercel
vercel            # first deploy, follow prompts
vercel env add FINNHUB_API_KEY
vercel --prod
```

## Project structure

```
app/
  page.tsx                 # market overview (indices + movers)
  stock/[symbol]/page.tsx  # stock detail with chart + stats
  api/search/route.ts      # ticker autocomplete (server-side keys)
  api/history/route.ts     # chart series for the client chart
components/                # small, focused UI components
lib/
  market.ts                # server-only data layer (Finnhub / Twelve Data)
  demo.ts                  # deterministic fallback data
```

Not investment advice; data may be delayed or simulated.
