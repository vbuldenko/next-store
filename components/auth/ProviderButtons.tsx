import { providerMap } from "@/auth/providers";
import { handleProviderSignIn } from "@/lib/actions/auth.actions";
import { FaGoogle } from "react-icons/fa";

interface ProviderButtonsProps {
  callbackUrl: string;
}

export default function ProviderButtons({ callbackUrl }: ProviderButtonsProps) {
  return (
    <div className="flex flex-col gap-4">
      {Object.values(providerMap).map((provider) => (
        <form key={provider.id} action={handleProviderSignIn} className="flex">
          <input type="hidden" name="providerId" value={provider.id} />
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
          >
            {provider.id === "google" && <FaGoogle className="text-black" />}
            <span className="text-gray-800">Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </div>
  );
}
