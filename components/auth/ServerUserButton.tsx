import { auth } from "@/auth";
import Link from "next/link";
import { HiOutlineUser } from "react-icons/hi";
import UserMenu from "./SignedInUserMenu";

// This is a Server Component (no "use client" directive)
export async function ServerUserButton() {
  const session = await auth();

  return (
    <>
      {session ? (
        <UserMenu
          user={{
            name: session.user?.name || "Guest",
            image: session.user?.image || null,
          }}
        />
      ) : (
        <Link href="/sign-in" className="flex items-center gap-2 text-sm">
          <HiOutlineUser className="h-5 w-5" />
          <span>Sign In</span>
        </Link>
      )}
    </>
  );
}
