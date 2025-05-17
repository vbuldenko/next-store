import { Skeleton } from "@/components/ui/skeleton";

interface ProductListSkeletonProps {
  count?: number;
  title?: string;
  showTitle?: boolean;
}

const ProductListSkeleton = ({
  count = 8,
  title = "Loading Products...",
  showTitle = false,
}: ProductListSkeletonProps) => {
  return (
    <div className="my-10">
      {showTitle && <h1>{title}</h1>}
      {!showTitle && <Skeleton className="h-7 w-48 mb-4" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="w-full max-w-sm">
              {/* Card skeleton */}
              <div className="rounded-lg border border-gray-100 shadow-sm">
                {/* Image skeleton */}
                <div className="p-0 items-center">
                  <Skeleton className="w-full aspect-square rounded-t-lg" />
                </div>

                {/* Content skeleton */}
                <div className="p-4 grid gap-4">
                  {/* Brand */}
                  <Skeleton className="h-4 w-16" />

                  {/* Product name */}
                  <Skeleton className="h-5 w-4/5" />

                  {/* Rating and price */}
                  <div className="flex justify-between items-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductListSkeleton;
