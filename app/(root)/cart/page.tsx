import CartTable from "@/components/cart/CartTable";
import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata = {
  title: "Shopping Cart",
};

export const dynamic = "force-dynamic";

const CartPage = async () => {
  const cart = await getMyCart();

  return <CartTable cart={cart} />;
};

export default CartPage;
