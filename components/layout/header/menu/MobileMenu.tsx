"use client";

import { HiX } from "react-icons/hi";
import SignInOutButton from "@/components/auth/SignInOutButton";
import CartIndicator from "./CartIndicator";
import ModeToggle from "../ModeToggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`absolute top-0 right-0 bottom-0 min-h-[100vh] w-64 bg-white dark:bg-black shadow-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <HiX className="size-6" />
            </button>
          </div>

          <div className="flex flex-col mt-4 gap-4 items-start">
            <ModeToggle />
            <SignInOutButton />
            <CartIndicator count={0} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
