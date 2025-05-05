"use server";

import { signIn } from "@/auth";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

const SIGNIN_ERROR_URL = "/error";

export async function handleProviderSignIn(formData: FormData) {
  const providerId = formData.get("providerId") as string;
  const callbackUrl = formData.get("callbackUrl") as string;
  try {
    await signIn(providerId, { redirectTo: callbackUrl ?? "" });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
    }
    throw error;
  }
}

export async function handleCredentialsSignIn(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
    }
    throw error;
  }
}
