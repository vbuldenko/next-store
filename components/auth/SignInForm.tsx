import { handleCredentialsSignIn } from "@/lib/actions/auth.actions";
import { HiKey, HiEnvelope } from "react-icons/hi2";
import InputField from "./InputField";

export default function SignInForm() {
  return (
    <form action={handleCredentialsSignIn} className="flex flex-col gap-4">
      <InputField
        icon={<HiEnvelope className="text-gray-400" />}
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        autoComplete="email"
      />

      <InputField
        icon={<HiKey className="text-gray-400" />}
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        autoComplete="current-password"
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Sign In
      </button>
    </form>
  );
}
