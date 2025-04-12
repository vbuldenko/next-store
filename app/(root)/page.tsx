import ProductList from "@/components/product/ProductList";
import sampleData from "@/lib/db/sample-data";

export default function Home() {
  return (
    <main>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={4}
      />
    </main>
  );
}
