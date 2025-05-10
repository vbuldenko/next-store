import SignInForm from "@/components/auth/SignInForm";
import ProviderButtons from "@/components/auth/ProviderButtons";
import AuthLayout from "@/components/auth/AuthLayout";

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <AuthLayout title="Sign In">
      <SignInForm />

      <div className="my-6 text-center text-gray-500">or</div>

      <ProviderButtons callbackUrl={props.searchParams?.callbackUrl ?? ""} />
    </AuthLayout>
  );
}
