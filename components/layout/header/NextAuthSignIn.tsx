import { handleGoogleSignIn } from "@/lib/actions/auth.actions";

export default function SignIn() {
  return (
    <form action={handleGoogleSignIn}>
      <button type="submit">Signin with Google</button>
    </form>
  );
}
