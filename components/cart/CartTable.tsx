"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Cart } from "@/types";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import ProceedButton from "../ui/proceedButton";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Button } from "../ui/button";
import OrderItemsTable from "./OrderItemsTable";

const EmptyCartState = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
    {/* Icon */}
    <div className="relative">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
        <HiOutlineShoppingBag className="w-12 h-12 text-blue-600" />
      </div>
      {/* Decorative elements */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-green-400 rounded-full animate-bounce" />
    </div>

    {/* Content */}
    <div className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
      <p className="text-gray-600 max-w-md">
        Looks like you have not added any items to your cart yet. Start
        exploring our amazing products!
      </p>
    </div>

    {/* Action Button */}
    <Link href="/">
      <Button
        size="lg"
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
      >
        <HiOutlineShoppingBag className="w-5 h-5 mr-2" />
        Start Shopping
      </Button>
    </Link>

    {/* Additional suggestions */}
    <div className="mt-8 pt-6 border-t border-gray-200 w-full max-w-md">
      <p className="text-sm text-gray-500 mb-3">Popular categories:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {["Electronics", "Clothing", "Books", "Home"].map((category) => (
          <Link
            key={category}
            href={`/search?category=${category.toLowerCase()}`}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

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
