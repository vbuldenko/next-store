"use client";
import { useState } from "react";
import ModeToggle from "./ModeToggle";
import {
  HiOutlineDotsHorizontal,
  HiOutlineShoppingBag,
  HiX,
} from "react-icons/hi";
import SignInOutButton from "@/components/auth/SignInOutButton";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex gap-3">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMenu}
        className="text-gray-700 hover:text-gray-900 md:hidden"
      >
        <HiOutlineDotsHorizontal className="size-6" />
      </button>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 right-0 min-h-[100vh] w-64 bg-white dark:bg-black shadow-md z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={toggleMenu}
              className="text-gray-700 cursor-pointer"
            >
              <HiX className="size-6" />
            </button>
          </div>

          <div className="flex flex-col mt-4 gap-4 items-start">
            <ModeToggle />
            <SignInOutButton />
            <button className="rounded-md hover:bg-gray-100 relative flex p-2">
              <HiOutlineShoppingBag className="size-6" />
              <span className="absolute top-1 right-1 bg-black text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                {0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />

        <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-medium">
          <SignInOutButton />

          <button className="relative cursor-pointer rounded-md hover:bg-gray-100 p-2">
            <HiOutlineShoppingBag className="size-6" />
            <span className="absolute top-1 right-1 bg-black text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
              {0}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
