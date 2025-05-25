"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import ProceedButton from "../ui/proceedButton";

type FormData = z.infer<typeof shippingAddressSchema>;

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "Enter full name" },
  { name: "streetAddress", label: "Address", placeholder: "Enter address" },
  { name: "city", label: "City", placeholder: "Enter city" },
  {
    name: "postalCode",
    label: "Postal Code",
    placeholder: "Enter postal code",
  },
  { name: "country", label: "Country", placeholder: "Enter country" },
] as const;

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address,
  });

  const onSubmit = async (values: FormData) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      router.push("/payment-method");
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="font-bold mt-4">Shipping Address</h1>
      <p className="text-sm text-gray-500">
        Please enter an address to ship to
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {fields.map(({ name, label, placeholder }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <ProceedButton isLoading={isPending} type="submit" text="Continue" />
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;
