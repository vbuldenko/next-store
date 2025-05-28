"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatId } from "@/lib/utils";
import { Order } from "@/types";
import OrderItemsTable from "../cart/OrderItemsTable";
import ShippingAddressCard from "./ShippingAdressCard";
import PaymentMethodCard from "./PaymentMethodCard";
import OrderSummaryCard from "./OrderSummaryCard";

type OrderDetailsTableProps = {
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
};

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: OrderDetailsTableProps) => {
  const {
    id,
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(id)}</h1>

      <div className="grid md:grid-cols-3 gap-4 md:gap-5">
        {/* Left Column - Order Details */}
        <div className="col-span-2 flex flex-col gap-4">
          <PaymentMethodCard
            paymentMethod={paymentMethod}
            paymentStatus={{
              isPaid,
              paidAt,
            }}
            showEditButton={false}
            showPaymentStatus={true}
          />

          <ShippingAddressCard
            address={shippingAddress}
            showEditButton={false}
            showDeliveryStatus={true}
            deliveryStatus={{
              isDelivered,
              deliveredAt,
            }}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">Order Items</h2>
              <OrderItemsTable
                items={orderItems}
                showQuantityControls={false}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <OrderSummaryCard
            summary={{
              itemsPrice,
              taxPrice,
              shippingPrice,
              totalPrice,
            }}
            payment={{
              method: paymentMethod,
              isPaid,
              paypalClientId,
              stripeClientSecret,
            }}
            adminActions={{
              isAdmin,
              isDelivered,
              orderId: id,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
