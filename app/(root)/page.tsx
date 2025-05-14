import ProductList from "@/components/product/ProductList";
import { getLatestProducts } from "@/lib/actions/product.actions";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  return (
    <main>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </main>
  );
}
