import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/lib/market";
import { RANGES, type Range } from "@/lib/types";

const SYMBOL_RE = /^[A-Za-z0-9.\-]{1,12}$/;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const symbol = params.get("symbol")?.toUpperCase() ?? "";
  const range = params.get("range") ?? "";

  if (!SYMBOL_RE.test(symbol) || !RANGES.includes(range as Range)) {
    return NextResponse.json({ error: "Invalid symbol or range" }, { status: 400 });
  }

  const candles = await getHistory(symbol, range as Range);
  return NextResponse.json(candles, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
  });
}
