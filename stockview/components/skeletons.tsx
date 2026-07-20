export function IndexCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading markets">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-5">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton mt-2 h-3 w-14" />
          <div className="mt-6 flex items-center justify-between">
            <div className="skeleton h-6 w-20" />
            <div className="skeleton h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MoversSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2" aria-label="Loading movers">
      {Array.from({ length: 2 }).map((_, col) => (
        <div key={col}>
          <div className="skeleton h-4 w-24" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="skeleton h-4 w-14" />
                  <div className="skeleton mt-1.5 h-3 w-32" />
                </div>
                <div className="skeleton h-4 w-16" />
                <div className="skeleton h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div aria-label="Loading stock">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton mt-4 h-8 w-56" />
      <div className="skeleton mt-3 h-10 w-40" />
      <div className="skeleton mt-8 h-64 rounded-2xl sm:h-80" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
