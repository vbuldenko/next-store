import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatDateTime } from "@/lib/utils";
import { HiCreditCard, HiCash } from "react-icons/hi";
import { SiPaypal, SiStripe, SiApplepay, SiGooglepay } from "react-icons/si";

// ========================================
// Types
// ========================================

type PaymentStatus = {
  isPaid: boolean;
  paidAt?: Date | null;
  transactionId?: string;
};

type PaymentMethodCardProps = {
  paymentMethod: string;
  showEditButton?: boolean;
  editHref?: string;
  editLabel?: string;
  paymentStatus?: PaymentStatus;
  showPaymentStatus?: boolean;
  showIcon?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
};

// ========================================
// Helper Functions
// ========================================

const getPaymentIcon = (method: string) => {
  const methodLower = method.toLowerCase();

  if (methodLower.includes("paypal"))
    return <SiPaypal className="w-5 h-5 text-blue-600" />;
  if (methodLower.includes("stripe"))
    return <SiStripe className="w-5 h-5 text-purple-600" />;
  if (methodLower.includes("apple"))
    return <SiApplepay className="w-5 h-5 text-black" />;
  if (methodLower.includes("google"))
    return <SiGooglepay className="w-5 h-5 text-blue-500" />;
  if (methodLower.includes("cash"))
    return <HiCash className="w-5 h-5 text-green-600" />;

  return <HiCreditCard className="w-5 h-5 text-gray-600" />;
};

const formatPaymentMethod = (method: string) => {
  // Capitalize and format common payment methods
  const formatted = method
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formatted;
};

// ========================================
// Component
// ========================================

export const PaymentMethodCard = ({
  paymentMethod,
  showEditButton = true,
  editHref = "/payment-method",
  editLabel = "Edit",
  paymentStatus,
  showPaymentStatus = false,
  showIcon = true,
  className = "",
  variant = "default",
}: PaymentMethodCardProps) => {
  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

  return (
    <Card className={className}>
      <CardContent className={isCompact ? "p-3 space-y-2" : "p-4 space-y-3"}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className={
              isCompact ? "text-lg font-semibold" : "text-xl font-semibold"
            }
          >
            Payment Method
          </h2>
          {showEditButton && (
            <Link href={editHref}>
              <Button variant="outline" size={isCompact ? "sm" : "lg"}>
                {editLabel}
              </Button>
            </Link>
          )}
        </div>

        {/* Payment Method Content */}
        <div className="flex items-center gap-3">
          {showIcon && getPaymentIcon(paymentMethod)}
          <div className="flex-1">
            <p
              className={`font-medium text-foreground ${
                isCompact ? "text-sm" : ""
              }`}
            >
              {formatPaymentMethod(paymentMethod)}
            </p>
            {isDetailed && paymentStatus?.transactionId && (
              <p className="text-xs text-muted-foreground mt-1">
                Transaction ID: {paymentStatus.transactionId}
              </p>
            )}
          </div>
        </div>

        {/* Payment Status */}
        {showPaymentStatus && paymentStatus && (
          <div className="pt-1">
            {paymentStatus.isPaid ? (
              <Badge variant="success" className="text-xs">
                Paid at {formatDateTime(paymentStatus.paidAt!).dateTime}
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Not Paid
              </Badge>
            )}
          </div>
        )}

        {/* Additional Details for Detailed Variant */}
        {isDetailed && (
          <div className="pt-2 border-t border-border/50">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 font-medium">
                  {paymentStatus?.isPaid ? "Paid" : "Pending"}
                </span>
              </div>
              {paymentStatus?.isPaid && paymentStatus.paidAt && (
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 font-medium">
                    {formatDateTime(paymentStatus.paidAt).dateOnly}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCard;
