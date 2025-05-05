import { Button } from "@/components/ui/button";
import { handleSignIn } from "@/lib/actions/auth.actions";

export default function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={(formData) => handleSignIn(provider as string, formData)}
      method="post"
    >
      <Button
        type="submit"
        className="cursor-pointer"
        {...props}
        variant={"outline"}
      >
        Sign In
      </Button>
    </form>
  );
}
