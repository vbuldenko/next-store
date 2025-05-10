"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiOutlineUser } from "react-icons/hi";
import UserMenu from "./SignedInUserMenu";
import SignInOutButtonSkeleton from "./SignInOutButtonSkeleton";

export default function SignInOutButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <SignInOutButtonSkeleton />;
  }

  if (status === "authenticated") {
    return (
      <UserMenu
        user={{
          name: session.user?.name,
          image: session.user?.image,
        }}
      />
    );
  }

  return (
    <Link href="/signin" className="flex items-center gap-2 text-sm">
      <HiOutlineUser className="h-5 w-5" />
      <span>Sign In</span>
    </Link>
  );
}
