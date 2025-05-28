import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import PlaceOrderForm from "@/components/place-order-form";
import OrderItemsTable from "@/components/cart/OrderItemsTable";

export const metadata: Metadata = {
  title: "Place Order",
};

// ========================================
// Components
// ========================================

const ShippingAddressCard = ({ address }: { address: ShippingAddress }) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Shipping Address</h2>
      <div className="space-y-1">
        <p className="font-medium">{address.fullName}</p>
        <p className="text-muted-foreground">
          {address.streetAddress}, {address.city} {address.postalCode},{" "}
          {address.country}
        </p>
      </div>
      <Link href="/shipping">
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const PaymentMethodCard = ({ paymentMethod }: { paymentMethod: string }) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      <p className="text-muted-foreground">{paymentMethod}</p>
      <Link href="/payment-method">
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const OrderItemsCard = ({ items }: { items: any[] }) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">Order Items</h2>
      <OrderItemsTable items={items} />
    </CardContent>
  </Card>
);

const OrderSummaryCard = ({ cart }: { cart: any }) => (
  <Card>
    <CardContent className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Items</span>
          <span>{formatCurrency(cart.itemsPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(cart.taxPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatCurrency(cart.shippingPrice)}</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(cart.totalPrice)}</span>
        </div>
      </div>

      <PlaceOrderForm />
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
          <ShippingAddressCard address={userAddress} />
          <PaymentMethodCard paymentMethod={user.paymentMethod} />
          <OrderItemsCard items={cart.items} />
        </div>

        {/* Right Column - Order Summary */}
        <div className="md:col-span-1">
          <OrderSummaryCard cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
