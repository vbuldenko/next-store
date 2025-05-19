"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Cart, CartItem } from "@/types";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { PiSpinner, PiSpinnerBold } from "react-icons/pi";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  // Track which action is pending
  const [pendingAction, setPendingAction] = useState<"add" | "remove" | null>(
    null
  );

  const handleAddToCart = async () => {
    setPendingAction("add");
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      // Handle success add to cart
      toast(res.message, {
        action: {
          label: "Go To Cart",
          onClick: () => router.push("/cart"),
        },
        icon: <HiOutlineBadgeCheck className="size-5" />,
      });
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    setPendingAction("remove");
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      return;
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div className="flex items-center justify-center gap-2">
      <Button
        className="btn-glow"
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending && pendingAction === "remove" ? (
          <PiSpinner className="size-4 animate-spin" />
        ) : (
          <AiOutlineMinus className="size-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        className="btn-glow"
        type="button"
        variant="outline"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending && pendingAction === "add" ? (
          <PiSpinner className="size-4 animate-spin" />
        ) : (
          <AiOutlinePlus className="size-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full flex gap-2 items-center justify-center"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <PiSpinnerBold className="size-4 animate-spin" />
      ) : (
        <AiOutlinePlus className="size-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;
