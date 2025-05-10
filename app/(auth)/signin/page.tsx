import SignInForm from "@/components/auth/SignInForm";
import ProviderButtons from "@/components/auth/ProviderButtons";
import AuthLayout from "@/components/auth/AuthLayout";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams?.callbackUrl ?? "/";

  return (
    <AuthLayout title="Sign In">
      <SignInForm />

      <div className="my-6 text-center text-gray-500">or</div>

      <ProviderButtons callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}
