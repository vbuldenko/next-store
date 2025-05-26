"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { paymentMethodSchema } from "@/lib/validators";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProceedButton from "./ui/proceedButton";

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

type PaymentMethodFormProps = {
  preferredPaymentMethod: string | null;
};

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: PaymentMethodFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const handleSubmit = async (values: PaymentMethodFormData) => {
    startTransition(async () => {
      const result = await updateUserPaymentMethod(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      router.push("/place-order");
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Payment Method</h1>
        <p className="text-sm text-gray-500">Please select a payment method</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-2"
                  >
                    {PAYMENT_METHODS.map((paymentMethod) => (
                      <div
                        key={paymentMethod}
                        className="flex items-center space-x-3"
                      >
                        <RadioGroupItem value={paymentMethod} />
                        <FormLabel className="font-normal cursor-pointer">
                          {paymentMethod}
                        </FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProceedButton isLoading={isPending} type="submit" text="Continue" />
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;
