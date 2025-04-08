import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const ClerkSignInOut = () => {
  return (
    <div className="relative flex gap-3">
      <SignedIn>
        <Link
          href="/dashboard"
          className="leading-none px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
        >
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "size-6",
              },
            }}
          />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <button className="cursor-pointer leading-none px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};
