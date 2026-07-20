import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length === 0 || q.length > 30) {
    return NextResponse.json([]);
  }
  const results = await searchSymbols(q);
  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
