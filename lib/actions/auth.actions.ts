"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signInFormSchema } from "../validators";
import { ZodError } from "zod";

const SIGNIN_ERROR_URL = "/error";

// Helper function to get error code from AuthError
function getAuthErrorCode(error: AuthError): string {
  if (error.message.includes("CredentialsSignin")) return "CredentialsSignin";
  if (error.message.includes("OAuthAccountNotLinked"))
    return "OAuthAccountNotLinked";
  if (error.message.includes("AccessDenied")) return "AccessDenied";
  if (error.message.includes("Verification")) return "Verification";
  if (error.message.includes("CallbackRouteError")) return "CallbackRouteError";
  if (error.message.includes("Configuration")) return "Configuration";
  return "Unknown";
}

// Map error codes to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password",
  OAuthAccountNotLinked: "Email already used with another provider",
  AccessDenied: "Access denied to this account",
  Verification: "The verification token is invalid or has expired",
  Configuration: "Authentication system misconfiguration",
  CallbackRouteError: "Error during authentication callback",
  Unknown: "Authentication failed",
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
      const errorCode = getAuthErrorCode(error);
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
    const email = formData.get("email");
    const password = formData.get("password");

    // Validate input before attempting authentication
    try {
      signInFormSchema.parse({ email, password });
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          validationErrors: formatZodErrors(error),
          message: "Please check your input",
        };
      }
    }

    // Attempt authentication
    await signIn("credentials", formData);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    // Handle Next.js redirect (this is not an error)
    if (isRedirectError(error)) {
      throw error;
    }

    // Handle authentication errors
    if (error instanceof AuthError) {
      const errorCode = getAuthErrorCode(error);
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
