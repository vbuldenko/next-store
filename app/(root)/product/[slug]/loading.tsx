import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Images Column */}
        <div className="col-span-2">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md" />
            ))}
          </div>
        </div>

        {/* Details Column */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            {/* Brand and category badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>

            {/* Product name */}
            <Skeleton className="h-8 w-3/4" />

            {/* Rating */}
            <Skeleton className="h-5 w-32" />

            {/* Reviews */}
            <Skeleton className="h-5 w-24" />

            {/* Price */}
            <Skeleton className="h-10 w-24 rounded-full" />

            {/* Description */}
            <div className="mt-6 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}
