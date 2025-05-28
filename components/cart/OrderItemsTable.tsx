import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import RemoveButton from "@/components/cart/RemoveButton";
import AddButton from "@/components/cart/AddButton";
import { CartItem } from "@/types";

// ========================================
// Types
// ========================================

type OrderItemsTableProps = {
  items: CartItem[];
  showQuantityControls?: boolean;
  className?: string;
};

// ========================================
// Component
// ========================================

const OrderItemsTable = ({
  items,
  showQuantityControls = false,
  className = "",
}: OrderItemsTableProps) => {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow className="border-b-gray-200">
          <TableHead>Item</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.slug}>
            {/* Item Details */}
            <TableCell>
              <Link
                href={`/product/${item.slug}`}
                className="flex items-center gap-2 hover:underline transition-colors"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            </TableCell>

            {/* Quantity */}
            <TableCell className="text-center">
              {showQuantityControls ? (
                <div className="flex items-center justify-center gap-2">
                  <RemoveButton item={item} />
                  <span className="min-w-[2rem] font-medium">{item.qty}</span>
                  <AddButton item={item} />
                </div>
              ) : (
                <span className="font-medium">{item.qty}</span>
              )}
            </TableCell>

            {/* Price */}
            <TableCell className="text-right font-medium">
              {formatCurrency(item.price)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderItemsTable;
