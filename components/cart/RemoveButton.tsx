"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";
import { AiOutlineMinus } from "react-icons/ai";
import { Button } from "../ui/button";
import { removeItemFromCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";

interface RemoveButtonProps {
  item: CartItem;
  showSuccessToast?: boolean;
}

export default function RemoveButton({
  item,
  showSuccessToast = false,
}: RemoveButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      if (showSuccessToast) {
        toast.success(res.message);
      }
    });
  };

  return (
    <Button
      className="btn-glow"
      disabled={isPending}
      variant="outline"
      type="button"
      onClick={handleRemoveFromCart}
    >
      {isPending ? (
        <PiSpinner className="size-4 animate-spin" />
      ) : (
        <AiOutlineMinus className="size-4" />
      )}
    </Button>
  );
}
