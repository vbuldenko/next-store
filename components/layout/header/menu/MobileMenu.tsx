"use client";
import { HiHome, HiOutlineUser, HiX } from "react-icons/hi";
import CartIndicator from "./CartIndicator";
import ModeToggle from "../ModeToggle";
import { useMobileMenu } from "./MobileMenuProvider";
import UserMenu from "@/components/auth/SignedInUserMenu";
import Link from "next/link";
import { Session } from "next-auth";
// import { ServerUserButton } from "@/components/auth/ServerUserButton";

const MobileMenu = ({ session }: { session: Session | null }) => {
  const { isOpen, toggle } = useMobileMenu();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-64 bg-white dark:bg-black shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={toggle}
              className="text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <HiX className="size-6" />
            </button>
          </div>

          <div className="flex flex-col mt-4 gap-4 items-start">
            <Link href="/" className="flex p-2 gap-2 text-sm">
              <HiHome className="size-6" />
            </Link>
            <ModeToggle />
            {session ? (
              <UserMenu
                user={{
                  name: session.user?.name || "Guest",
                  image: session.user?.image || null,
                }}
              />
            ) : (
              <Link href="/sign-in" className="flex p-2 gap-2 text-sm">
                <HiOutlineUser className="size-6" />
                <span>Sign In</span>
              </Link>
            )}

            {/* <ServerUserButton /> */}

            <CartIndicator />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
