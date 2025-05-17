"use client";

import { useState } from "react";
import { HiMenu, HiOutlineDotsHorizontal } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/useScroll";

// Component imports
import HeaderSearchBar from "./SearchBar";
import Announcements from "./Announcements";
import { Logo } from "./Logo";
import MobileMenu from "./menu/MobileMenu";
import DesktopMenu from "./menu/DesktopMenu";
import ProgressIndicator from "./ProgressIndicator";

type HeaderProps = {
  categorySelector?: React.ReactNode;
};

const Header = ({ categorySelector }: HeaderProps) => {
  const isVisible = useScroll({
    threshold: 100,
    debounceTime: 50,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full">
      <ProgressIndicator />
      <div
        className={cn(
          "transform transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <Announcements />

        {/* Main navigation bar */}
        <nav className="w-full bg-white/60 py-3 shadow-sm backdrop-blur-md dark:bg-black/60 sm:py-4">
          <div className="container mx-auto flex items-center justify-between px-8">
            {/* Left section: Mobile menu toggle & category links */}
            <div className="flex items-center justify-start gap-4 sm:gap-6">
              <button
                aria-label="Open menu"
                className="cursor-pointer text-gray-700 hover:text-gray-900 md:hidden"
              >
                <HiMenu className="size-6" />
              </button>

              {/* Desktop categories navigation */}
              <div className="hidden text-sm font-medium md:flex md:gap-4 lg:gap-6">
                {categorySelector}
              </div>
            </div>

            {/* Center section: Logo & search */}
            <div className="flex items-center justify-center">
              <Logo />
              <HeaderSearchBar />
            </div>

            {/* Right section: Mobile menu toggle & desktop menu */}
            <div className="flex gap-3">
              <button
                onClick={toggleMenu}
                aria-label="Toggle mobile menu"
                className="cursor-pointer text-gray-700 hover:text-gray-900 md:hidden"
              >
                <HiOutlineDotsHorizontal className="size-6" />
              </button>

              <DesktopMenu />
            </div>
          </div>
        </nav>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMenu} />
    </header>
  );
};

export default Header;
