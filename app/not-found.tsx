import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <h2 className="text-xl font-semibold tracking-tight">Page not found</h2>
      <p className="mt-2 max-w-sm text-[15px] text-ink-2">
        That page doesn&rsquo;t exist. Try searching for a ticker instead.
      </p>
      <Link
        href="/"
        className="pressable mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg"
      >
        Back to markets
      </Link>
    </div>
  );
}
