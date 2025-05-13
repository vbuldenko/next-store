"use server";

import { signIn } from "@/auth";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

interface ExtendedAuthError extends AuthError {
  type: string;
}

const SIGNIN_ERROR_URL = "/error";

export async function handleProviderSignIn(formData: FormData) {
  const providerId = formData.get("providerId") as string;
  const callbackUrl = formData.get("callbackUrl") as string;
  try {
    await signIn(providerId, { redirectTo: callbackUrl ?? "" });
  } catch (error) {
    if ((error as ExtendedAuthError).type) {
      return redirect(
        `${SIGNIN_ERROR_URL}?error=${(error as ExtendedAuthError).type}`
      );
    }
    throw error;
  }
}

export async function handleCredentialsSignIn(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if ((error as ExtendedAuthError).type) {
      return redirect(
        `${SIGNIN_ERROR_URL}?error=${(error as ExtendedAuthError).type}`
      );
    }
    throw error;
  }
}
