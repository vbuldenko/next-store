"use client";
import { useState } from "react";
import DesktopMenu from "./DesktopMenu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import MobileMenu from "./MobileMenu";

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

      {/* Mobile Menu with Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />

      {/* Desktop Menu */}
      <DesktopMenu />
    </div>
  );
};

export default Menu;
