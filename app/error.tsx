"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <h2 className="text-xl font-semibold tracking-tight">Something went wrong</h2>
      <p className="mt-2 max-w-sm text-[15px] text-ink-2">
        We couldn&rsquo;t load market data right now. It&rsquo;s usually temporary.
      </p>
      <button
        type="button"
        onClick={reset}
        className="pressable mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg"
      >
        Try again
      </button>
    </div>
  );
}
