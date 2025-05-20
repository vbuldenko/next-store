import ProductList from "@/components/product/ProductList";
import FancyButton from "@/components/ui/ripple-el/FancyButton";

import RippleWrapper from "@/components/ui/ripple-el/RippleWrapper";
import { getLatestProducts } from "@/lib/actions/product.actions";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />

      <div className="flex gap-2">
        <RippleWrapper className="flex items-center justify-center size-50 bg-black text-white rounded-lg">
          Tap me
        </RippleWrapper>

        <FancyButton />
      </div>
    </>
  );
}
