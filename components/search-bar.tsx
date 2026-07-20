"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/lib/types";

export function SearchBar() {
  const router = useRouter();
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  async function runSearch(q: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
      if (!res.ok) return;
      const data: SearchResult[] = await res.json();
      setResults(data);
      setActive(-1);
      setOpen(true);
    } catch {
      // aborted or offline — keep whatever is shown
    }
  }

  function onChange(value: string) {
    setQuery(value);
    clearTimeout(timerRef.current);
    const q = value.trim();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(() => runSearch(q), 250);
  }

  const go = useCallback(
    (symbol: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/stock/${encodeURIComponent(symbol)}`);
    },
    [router],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) {
      if (e.key === "Enter" && query.trim()) go(query.trim().toUpperCase());
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? results.length - 1 : a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active >= 0 ? results[active].symbol : results[0].symbol);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-label="Search stocks"
        placeholder="Search stocks…"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-base text-ink placeholder:text-ink-3 transition-colors duration-150 hover:border-line-2 focus:border-line-2 focus:outline-none sm:h-10 sm:text-[15px]"
      />
      {open && results.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-line bg-surface py-1.5 shadow-lg shadow-black/5"
        >
          {results.map((r, i) => (
            <li key={r.symbol} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.symbol)}
                className={`flex w-full items-baseline gap-3 px-4 py-3 text-left transition-colors duration-100 sm:py-2.5 ${
                  i === active ? "bg-surface-2" : ""
                }`}
              >
                <span className="w-14 shrink-0 text-sm font-semibold">{r.symbol}</span>
                <span className="truncate text-sm text-ink-2">{r.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
