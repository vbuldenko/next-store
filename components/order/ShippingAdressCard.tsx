import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ShippingAddress } from "@/types";
import { formatDateTime } from "@/lib/utils";

// ========================================
// Types
// ========================================

type DeliveryStatus = {
  isDelivered: boolean;
  deliveredAt?: Date | null;
};

type ShippingAddressCardProps = {
  address: ShippingAddress;
  showEditButton?: boolean;
  editHref?: string;
  editLabel?: string;
  deliveryStatus?: DeliveryStatus;
  showDeliveryStatus?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
};

// ========================================
// Component
// ========================================

export const ShippingAddressCard = ({
  address,
  showEditButton = true,
  editHref = "/shipping-address",
  editLabel = "Edit",
  deliveryStatus,
  showDeliveryStatus = false,
  className = "",
  variant = "default",
}: ShippingAddressCardProps) => {
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
            Shipping Address
          </h2>
          {showEditButton && (
            <Link href={editHref}>
              <Button variant="outline" size={isCompact ? "sm" : "lg"}>
                {editLabel}
              </Button>
            </Link>
          )}
        </div>

        {/* Address Content */}
        <div className={isCompact ? "space-y-1" : "space-y-2"}>
          <p className="font-medium text-foreground">{address.fullName}</p>

          {isDetailed ? (
            // Detailed format - each field on separate line
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{address.streetAddress}</p>
              <p>
                {address.city}, {address.postalCode}
              </p>
              <p>{address.country}</p>
              {/* {address?.phone && <p>Phone: {address.phone}</p>} */}
            </div>
          ) : (
            // Default/Compact format - inline
            <p
              className={`text-muted-foreground ${isCompact ? "text-sm" : ""}`}
            >
              {address.streetAddress}, {address.city} {address.postalCode},{" "}
              {address.country}
            </p>
          )}
        </div>

        {/* Delivery Status */}
        {showDeliveryStatus && deliveryStatus && (
          <div className="pt-2">
            {deliveryStatus.isDelivered ? (
              <Badge variant="success" className="text-xs">
                Delivered at{" "}
                {formatDateTime(deliveryStatus.deliveredAt!).dateTime}
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Not Delivered
              </Badge>
            )}
          </div>
        )}

        {/* Additional Info for Detailed Variant */}
        {/* {isDetailed && address.instructions && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Instructions:</span>{" "}
              {address.instructions}
            </p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default ShippingAddressCard;
