"use client";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";
import { PiSpinner } from "react-icons/pi";
import { AiOutlinePlus } from "react-icons/ai";
import { CartItem } from "@/types";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useRouter } from "next/navigation";

interface AddButtonProps {
  item: CartItem;
  showSuccessToast?: boolean;
}

export default function AddButton({
  item,
  showSuccessToast = false,
}: AddButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      if (showSuccessToast) {
        toast(res.message, {
          action: {
            label: "Go To Cart",
            onClick: () => router.push("/cart"),
          },
          icon: <HiOutlineBadgeCheck className="size-5" />,
        });
      }
    });
  };

  return (
    <Button
      className="btn-glow"
      disabled={isPending}
      variant="outline"
      type="button"
      onClick={handleAddToCart}
    >
      {isPending ? (
        <PiSpinner className="size-4 animate-spin" />
      ) : (
        <AiOutlinePlus className="size-4" />
      )}
    </Button>
  );
}
