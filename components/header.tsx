import Link from "next/link";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight"
          aria-label="Stockview home"
        >
          Stockview
        </Link>
        <div className="order-last w-full sm:order-none sm:ml-auto sm:w-auto sm:max-w-sm sm:flex-1">
          <SearchBar />
        </div>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
