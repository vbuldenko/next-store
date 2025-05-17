"use client";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useMobileMenu } from "./MobileMenuProvider";

export function MobileMenuToggle() {
  const { toggle } = useMobileMenu();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle mobile menu"
      className="cursor-pointer text-gray-700 hover:text-gray-900 md:hidden"
    >
      <HiOutlineDotsHorizontal className="size-6" />
    </button>
  );
}
