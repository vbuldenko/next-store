"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createOrder } from "@/lib/actions/order.actions";
import ProceedButton from "./ui/proceedButton";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return <ProceedButton isLoading={pending} text="Place Order" />;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
