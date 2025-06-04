"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/user.actions";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProfileForm = () => {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      const result = await updateProfile(values);
      if (!result.success) return toast.error(result.message);

      await update({
        ...session,
        user: { ...session?.user, name: values.name },
      });
      toast.success(result.message);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const fields = [
    {
      name: "email" as const,
      label: "Email",
      disabled: true,
      className: "bg-gray-50/80",
    },
    { name: "name" as const, label: "Name", placeholder: "Enter your name" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex-center gap-6 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-2xl font-bold text-white">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Profile Settings
          </h1>
          <p className="text-gray-500 text-sm">
            Update your personal information
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-b from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            {fields.map(({ name, label, ...props }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      {label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        {...props}
                        className={`h-12 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all ${
                          props.className || ""
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-6"
            >
              {form.formState.isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Info */}
      <div className="w-full mt-6 bg-blue-50/70 border border-blue-200/50 rounded-xl p-4">
        <p className="text-sm text-blue-700 text-center">
          Email is protected for security reasons
        </p>
      </div>
    </div>
  );
};

export default ProfileForm;
