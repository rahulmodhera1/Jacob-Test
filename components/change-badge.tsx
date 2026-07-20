import { formatPercent } from "@/lib/format";

export function ChangeBadge({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`tnum inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[13px] font-medium ${
        up ? "bg-gain-bg text-gain" : "bg-loss-bg text-loss"
      }`}
    >
      <svg className="size-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
        {up ? <path d="M6 2.5 10.5 8h-9L6 2.5Z" /> : <path d="M6 9.5 1.5 4h9L6 9.5Z" />}
      </svg>
      {formatPercent(value)}
    </span>
  );
}
