import { IndexCardSkeleton, MoversSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="space-y-12">
      <section>
        <div className="skeleton h-9 w-40" />
        <div className="skeleton mt-2 h-4 w-48" />
        <div className="mt-6">
          <IndexCardSkeleton />
        </div>
      </section>
      <section>
        <div className="skeleton h-6 w-40" />
        <div className="mt-4">
          <MoversSkeleton />
        </div>
      </section>
    </div>
  );
}
