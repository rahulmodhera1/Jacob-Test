import Link from "next/link";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-5 py-3.5 sm:px-8">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight"
          aria-label="Stockview home"
        >
          Stockview
        </Link>
        <div className="ml-auto hidden w-full max-w-sm sm:block">
          <SearchBar />
        </div>
        <div className="ml-auto sm:ml-0">
          <ThemeToggle />
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-5 pb-3 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
