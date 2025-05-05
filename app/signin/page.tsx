import { providerMap } from "@/auth";
import {
  handleCredentialsSignIn,
  handleProviderSignIn,
} from "@/lib/actions/auth.actions";
import { FaGoogle } from "react-icons/fa";
import { HiKey, HiEnvelope } from "react-icons/hi2";

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Sign In
        </h1>

        {/* Credentials Sign-In Form */}
        <form action={handleCredentialsSignIn} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <HiEnvelope className="text-gray-400" />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-full bg-transparent outline-none text-gray-800"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <HiKey className="text-gray-400" />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none text-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">or</div>

        {/* Provider Sign-In Buttons */}
        <div className="flex flex-col gap-4">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.id}
              action={handleProviderSignIn}
              className="flex"
            >
              <input type="hidden" name="providerId" value={provider.id} />
              <input
                type="hidden"
                name="callbackUrl"
                value={props.searchParams?.callbackUrl ?? ""}
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <FaGoogle className="text-gray-500" />
                <span className="text-gray-800">
                  Sign in with {provider.name}
                </span>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
