"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createOrder } from "@/lib/actions/order.actions";
import { toast } from "sonner";
import { IoCheckmarkDone } from "react-icons/io5";
import ProceedButton from "../ui/proceedButton";

const PlaceOrderForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const res = await createOrder();

        if (!res.success) {
          toast.error(res.message);
          if (res.redirectTo) {
            router.push(res.redirectTo);
          }
          return;
        }

        toast.success(res.message);
        if (res.redirectTo) {
          router.push(res.redirectTo);
        }
      } catch (error) {
        console.error("Order creation error:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <ProceedButton
        isLoading={isPending}
        text="Place Order"
        icon={<IoCheckmarkDone className="size-5" />}
        type="submit"
        className="w-full"
      />
    </form>
  );
};

export default PlaceOrderForm;
