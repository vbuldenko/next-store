import ProductListSkeleton from "@/components/ui/skeletons/ProductList";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4">
      <ProductListSkeleton count={4} />
    </div>
  );
}
