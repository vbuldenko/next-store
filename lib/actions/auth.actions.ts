"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { ZodError } from "zod";
import { hash } from "../encrypt";
import prisma from "../db/prisma";
import { formatError } from "../utils";

const SIGNIN_ERROR_URL = "/error";

type AuthErrorWithCause = Error & {
  cause?: {
    err?: { message?: string };
    message?: string;
  };
};

// Helper function to get error code from AuthError
function getAuthErrorCode(error: AuthErrorWithCause): string {
  const message =
    error.cause?.err?.message || error.cause?.message || error.message;

  if (message.includes("No credentials provided")) return "NoCredentials";
  if (message.includes("Invalid credentials")) return "InvalidCredentials";
  if (message.includes("CredentialsSignin")) return "CredentialsSignin";
  if (message.includes("OAuthAccountNotLinked")) return "OAuthAccountNotLinked";
  if (message.includes("AccessDenied")) return "AccessDenied";
  if (message.includes("Verification")) return "Verification";
  if (message.includes("CallbackRouteError")) return "CallbackRouteError";
  if (message.includes("Configuration")) return "Configuration";
  return "Unknown";
}

const ERROR_MESSAGES: Record<string, string> = {
  NoCredentials: "Please provide both email and password.",
  InvalidCredentials: "Invalid email or password.",
  CredentialsSignin: "Invalid email or password.",
  OAuthAccountNotLinked: "Email already used with another provider.",
  AccessDenied: "Access denied to this account.",
  Verification: "The verification token is invalid or has expired.",
  Configuration: "Authentication system misconfiguration.",
  CallbackRouteError: "Error during authentication callback.",
  Unknown: "Authentication failed.",
};

// Format Zod validation errors
function formatZodErrors(error: ZodError): Record<string, string> {
  return error.errors.reduce((acc, curr) => {
    const path = curr.path.join(".");
    acc[path] = curr.message;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Handle OAuth provider sign-in (Google, GitHub, etc.)
 */
export async function handleProviderSignIn(formData: FormData) {
  const providerId = formData.get("providerId") as string;
  const callbackUrl = formData.get("callbackUrl") as string;

  try {
    await signIn(providerId, { redirectTo: callbackUrl || "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      const errorCode = getAuthErrorCode(error as AuthErrorWithCause);
      return redirect(`${SIGNIN_ERROR_URL}?error=${errorCode}`);
    }
    throw error;
  }
}

/**
 * Handle credentials sign-in with form validation
 */
export async function authenticate(prevState: unknown, formData: FormData) {
  try {
    signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", formData);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    // Handle Next.js redirect (this is not an error)
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      return {
        success: false,
        validationErrors: formatZodErrors(error),
        message: "Please check your input",
      };
    }

    // Handle authentication errors
    if (error instanceof AuthError) {
      const errorCode = getAuthErrorCode(error as AuthErrorWithCause);
      const errorMessage = ERROR_MESSAGES[errorCode];

      // Log configuration errors for debugging
      if (errorCode === "Configuration") {
        console.error("Authentication configuration error:", error);
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    // Handle unexpected errors
    console.error("Unexpected authentication error:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;

    user.password = await hash(plainPassword);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        validationErrors: formatZodErrors(error),
        message: "Please check your input",
      };
    }

    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}
