import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthLayout from "@/components/auth/AuthLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <AuthLayout title="Sign Up">
      <SignUpForm />

      <div className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          target="_self"
          className="text-primary hover:underline transition-colors font-medium"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
