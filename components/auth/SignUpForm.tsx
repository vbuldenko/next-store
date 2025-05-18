"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/auth/InputField";
// import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUp } from "@/lib/actions/auth.actions";
import { useSearchParams } from "next/navigation";
import { HiKey, HiUserAdd } from "react-icons/hi";
import { HiEnvelope } from "react-icons/hi2";

type FormState = {
  success: boolean;
  message: string;
  validationErrors?: Record<string, string>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      className="w-full"
      variant="default"
    >
      {pending ? "Submitting..." : "Sign Up"}
    </Button>
  );
}

const SignUpForm = () => {
  const initialState: FormState = {
    success: false,
    message: "",
    validationErrors: {},
  };
  const [state, action] = useActionState(signUp, initialState);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          {/* <Label htmlFor="email">Name</Label> */}
          <Input
            icon={<HiUserAdd className="text-gray-400" />}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Name"
            defaultValue={signUpDefaultValues.email}
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!state.validationErrors?.name}
            aria-describedby={
              state.validationErrors?.name ? "name-error" : undefined
            }
          />
          {state.validationErrors?.name && (
            <p id="name-error" className="text-red-500 text-xs mt-1">
              {state.validationErrors.name}
            </p>
          )}
        </div>
        <div>
          {/* <Label htmlFor="email">Email</Label> */}
          <Input
            icon={<HiEnvelope className="text-gray-400" />}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
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
        <div>
          {/* <Label htmlFor="password">Password</Label> */}
          <Input
            icon={<HiKey className="text-gray-400" />}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            defaultValue={signUpDefaultValues.password}
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
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
        <div>
          {/* <Label htmlFor="confirmPassword">Confirm Password</Label> */}
          <Input
            icon={<HiKey className="text-gray-400" />}
            type="confirmPassword"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="confirm-Password"
            defaultValue={signUpDefaultValues.confirmPassword}
            // value={confirmPassword}
            // onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={!!state.validationErrors?.confirmPassword}
            aria-describedby={
              state.validationErrors?.confirmPassword
                ? "confirmPassword-error"
                : undefined
            }
          />
          {state.validationErrors?.confirmPassword && (
            <p id="confirmPassword-error" className="text-red-500 text-xs mt-1">
              {state.validationErrors.password}
            </p>
          )}
        </div>
        <div>
          <SubmitButton />
        </div>

        {state && !state.success && (
          <div className="text-center text-red-500">{state.message}</div>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
