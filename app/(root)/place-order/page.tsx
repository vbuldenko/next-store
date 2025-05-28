import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { CartItem, ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Card, CardContent } from "@/components/ui/card";
import PlaceOrderForm from "@/components/order/PlaceOrderForm";
import OrderItemsTable from "@/components/cart/OrderItemsTable";
import ShippingAddressCard from "@/components/order/ShippingAdressCard";
import PaymentMethodCard from "@/components/order/PaymentMethodCard";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";

export const metadata: Metadata = {
  title: "Place Order",
};

// ========================================
// Components
// ========================================

const OrderItemsCard = ({ items }: { items: CartItem[] }) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Order Items</h2>
      <OrderItemsTable items={items} />
    </CardContent>
  </Card>
);

// ========================================
// Main Page Component
// ========================================

const PlaceOrderPage = async () => {
  // Get user session and validate authentication
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  // Fetch user data and cart
  const [cart, user] = await Promise.all([getMyCart(), getUserById(userId)]);

  // Validation and redirects
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  if (!user.address) {
    redirect("/shipping-address");
  }

  if (!user.paymentMethod) {
    redirect("/payment-method");
  }

  const userAddress = user.address as ShippingAddress;

  return (
    <div className="container mx-auto px-4 py-6">
      <CheckoutSteps current={3} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Place Order</h1>
        <p className="text-muted-foreground">
          Review your order details before placing
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="md:col-span-2 space-y-6">
          <ShippingAddressCard address={userAddress} showEditButton={true} />
          <PaymentMethodCard paymentMethod={user.paymentMethod} />
          <OrderItemsCard items={cart.items} />
        </div>

        {/* Right Column - Order Summary */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <OrderSummaryCard summary={cart} />
          <PlaceOrderForm />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
