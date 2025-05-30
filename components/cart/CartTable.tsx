"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Cart } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import ProceedButton from "../ui/proceedButton";
import OrderItemsTable from "./OrderItemsTable";
import { EmptyCartState } from "./EmptyCartState";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 font-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <EmptyCartState />
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <OrderItemsTable items={cart.items} showQuantityControls />
          </div>

          <Card>
            <CardContent className="p-4 gap-4">
              <div className="flex flex-wrap gap-2 pb-3 text-xl">
                <span className="min-w-max">
                  Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                </span>

                <span className="font-bold">
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <ProceedButton
                isLoading={isPending}
                onClick={() => startTransition(() => router.push("/shipping"))}
                text="Proceed to Checkout"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
