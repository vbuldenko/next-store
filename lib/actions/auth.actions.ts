"use server";

import { signIn } from "@/auth";

export async function handleGoogleSignIn() {
  await signIn("google");
}

export async function handleSignIn(provider: string, formData?: FormData) {
  await signIn(provider, formData);
}
