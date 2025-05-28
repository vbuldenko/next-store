"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  deliverOrder,
} from "@/lib/actions/order.actions";
import StripePayment from "../../app/(root)/order/[id]/stripe-payment";

// ========================================
// Types
// ========================================

type OrderSummaryData = {
  itemsPrice: string | number;
  taxPrice: string | number;
  shippingPrice: string | number;
  totalPrice: string | number;
};

type PaymentConfig = {
  method: string;
  isPaid: boolean;
  paypalClientId?: string;
  stripeClientSecret?: string | null;
};

type AdminActions = {
  isAdmin: boolean;
  isDelivered: boolean;
  orderId: string;
};

type OrderSummaryCardProps = {
  summary: OrderSummaryData;
  payment?: PaymentConfig;
  adminActions?: AdminActions;
  showPaymentButtons?: boolean;
  showAdminActions?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
  children?: React.ReactNode;
};

// ========================================
// Helper Components
// ========================================

const PrintLoadingState = () => {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending)
    return (
      <div className="text-sm text-muted-foreground">Loading PayPal...</div>
    );
  if (isRejected)
    return <div className="text-sm text-destructive">Error Loading PayPal</div>;

  return null;
};

const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      const res = await updateOrderToPaidCOD(orderId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={handleMarkAsPaid}
      className="w-full"
    >
      {isPending ? "Processing..." : "Mark As Paid"}
    </Button>
  );
};

const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsDelivered = () => {
    startTransition(async () => {
      const res = await deliverOrder(orderId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    });
  };

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={handleMarkAsDelivered}
      className="w-full"
    >
      {isPending ? "Processing..." : "Mark As Delivered"}
    </Button>
  );
};

// ========================================
// Main Component
// ========================================

export const OrderSummaryCard = ({
  summary,
  payment,
  adminActions,
  showPaymentButtons = true,
  showAdminActions = true,
  className = "",
  variant = "default",
  children,
}: OrderSummaryCardProps) => {
  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

  const handleCreatePayPalOrder = async () => {
    if (!adminActions?.orderId) return;

    const res = await createPayPalOrder(adminActions.orderId);
    if (!res.success) {
      toast.error(res.message);
    }
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    if (!adminActions?.orderId) return;

    const res = await approvePayPalOrder(adminActions.orderId, data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
  };

  return (
    <Card className={className}>
      <CardContent className={isCompact ? "p-3 space-y-3" : "p-4 space-y-4"}>
        {/* Header */}
        <h2
          className={
            isCompact ? "text-lg font-semibold" : "text-xl font-semibold"
          }
        >
          Order Summary
        </h2>

        {/* Summary Items */}
        <div className={isCompact ? "space-y-2" : "space-y-3"}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items</span>
            <span className="font-medium">
              {formatCurrency(summary.itemsPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">
              {formatCurrency(summary.taxPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">
              {formatCurrency(summary.shippingPrice)}
            </span>
          </div>

          <hr className="border-border" />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(summary.totalPrice)}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        {isDetailed && (
          <div className="pt-2 border-t border-border/50 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                {formatCurrency(
                  Number(summary.totalPrice) -
                    Number(summary.taxPrice) -
                    Number(summary.shippingPrice)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax Rate</span>
              <span>
                {(
                  (Number(summary.taxPrice) / Number(summary.itemsPrice)) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        )}

        {/* Payment Buttons */}
        {showPaymentButtons && payment && !payment.isPaid && (
          <div className="space-y-3">
            {/* PayPal Payment */}
            {payment.method === "PayPal" && payment.paypalClientId && (
              <div className="space-y-2">
                <PayPalScriptProvider
                  options={{ clientId: payment.paypalClientId }}
                >
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {/* Stripe Payment */}
            {payment.method === "Stripe" &&
              payment.stripeClientSecret &&
              adminActions?.orderId && (
                <StripePayment
                  priceInCents={Number(summary.totalPrice) * 100}
                  orderId={adminActions.orderId}
                  clientSecret={payment.stripeClientSecret}
                />
              )}
          </div>
        )}

        {/* Admin Actions */}
        {showAdminActions && adminActions?.isAdmin && adminActions.orderId && (
          <div className="space-y-3">
            {/* Cash On Delivery - Mark as Paid */}
            {!payment?.isPaid && payment?.method === "CashOnDelivery" && (
              <MarkAsPaidButton orderId={adminActions.orderId} />
            )}

            {/* Mark as Delivered */}
            {payment?.isPaid && !adminActions.isDelivered && (
              <MarkAsDeliveredButton orderId={adminActions.orderId} />
            )}
          </div>
        )}

        {/* Custom Content */}
        {children}
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
