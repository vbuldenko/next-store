"use client";

import { authenticate } from "@/lib/actions/auth.actions";
import { HiKey, HiEnvelope } from "react-icons/hi2";
import InputField from "./InputField";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { useState } from "react";

// Define the form state type for better type safety
type FormState = {
  success: boolean;
  message?: string;
  validationErrors?: Record<string, string>;
};

// Separate the button into its own component to optimize rendering
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className="w-full"
      variant="default"
    >
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}

export default function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  // Track input values to preserve them on errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const initialState: FormState = {
    success: false,
    message: "",
    validationErrors: {},
  };

  const [state, formAction] = useActionState(authenticate, initialState);

  const handleFormAction = (formData: FormData) => {
    formData.append("callbackUrl", callbackUrl);

    // Store the current values (in case validation fails)
    setEmail(formData.get("email") as string);
    setPassword(formData.get("password") as string);

    formAction(formData);
  };

  return (
    <form action={handleFormAction} className="flex flex-col gap-4">
      {/* Generic error message at the top */}
      {state.message && !state.success && (
        <div className="p-3 text-sm rounded-md bg-red-50 text-red-500 border border-red-200">
          {state.message}
        </div>
      )}

      <div className="space-y-1">
        <InputField
          icon={<HiEnvelope className="text-gray-400" />}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!state.validationErrors?.email}
          aria-describedby={
            state.validationErrors?.email ? "email-error" : undefined
          }
        />
        {state.validationErrors?.email && (
          <p id="email-error" className="text-red-500 text-xs mt-1">
            {state.validationErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <InputField
          icon={<HiKey className="text-gray-400" />}
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!state.validationErrors?.password}
          aria-describedby={
            state.validationErrors?.password ? "password-error" : undefined
          }
        />
        {state.validationErrors?.password && (
          <p id="password-error" className="text-red-500 text-xs mt-1">
            {state.validationErrors.password}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <a
          href="/forgot-password"
          className="text-xs text-blue-600 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <SubmitButton />
    </form>
  );
}
