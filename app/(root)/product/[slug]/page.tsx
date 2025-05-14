// import { auth } from "@/auth";
// import AddToCart from "@/components/product/AddToCart";
import ProductImages from "@/components/product/ProductImages";
import ProductPrice from "@/components/product/ProductPrice";
import Rating from "@/components/product/rating";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
// import { getMyCart } from "@/lib/actions/cart.actions";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { MdBrandingWatermark, MdCategory } from "react-icons/md";

export default async function page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // const session = await auth();
  // const userId = session?.user?.id;

  // const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images Column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          {/* Details Column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                  <MdBrandingWatermark className="h-4 w-4" />
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
                  <MdCategory className="h-4 w-4" />
                  <span>{product.category}</span>
                </div>
              </div>
              <h1 className="font-bold text-xl">{product.name}</h1>
              <Rating value={Number(product.rating)} />
              <p>{product.numReviews} reviews</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="flex justify-center items-center">
                    {/* <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    /> */}
                    <button className="py-1 px-4 bg-black text-white rounded-2xl">
                      Add to cart
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10"></section>
    </>
  );
}
