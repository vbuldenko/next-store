"use client";

import { HiOutlineUser, HiOutlineLogout } from "react-icons/hi";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface UserMenuProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="relative group">
      <Link
        href="/user"
        className="flex items-center gap-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-2"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            className="h-6 w-6 rounded-full"
            width={24}
            height={24}
          />
        ) : (
          <HiOutlineUser className="h-5 w-5" />
        )}
        <span className="hidden lg:inline">
          {user.name?.split(" ")[0] || "Account"}
        </span>
      </Link>

      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg overflow-hidden z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-150 transform translate-y-1 group-hover:translate-y-0">
        <div className="py-2">
          {/* <Link
            href="/account"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            My Account
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Orders
          </Link> */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
          >
            <HiOutlineLogout className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
