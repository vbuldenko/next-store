import SignInForm from "@/components/auth/SignInForm";
import ProviderButtons from "@/components/auth/ProviderButtons";
import AuthLayout from "@/components/auth/AuthLayout";
import Link from "next/link";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams?.callbackUrl ?? "/";

  return (
    <AuthLayout title="Sign In">
      <SignInForm callbackUrl={callbackUrl} />

      <div className="my-8 flex items-center justify-center">
        <div className="h-px bg-gray-200 flex-grow" />
        <span className="px-4 text-sm text-gray-400 font-light">
          or continue with
        </span>
        <div className="h-px bg-gray-200 flex-grow" />
      </div>

      <ProviderButtons callbackUrl={callbackUrl} />

      <div className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          target="_self"
          className="text-primary hover:underline transition-colors font-medium"
        >
          Sign Up
        </Link>
      </div>
    </AuthLayout>
  );
}
