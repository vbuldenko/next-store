"use client";
// import { logoutUser } from '@/actions/auth';
import HeaderSearchBar from "./SearchBar";
// import { useCartStore } from '@/stores/cart-store';
// import { User } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Announcements from "./Announcements";
import clsx from "clsx";
import {
  HiMenu,
  // HiOutlineDotsHorizontal,
  // HiOutlineShoppingBag,
} from "react-icons/hi";
// import { ClerkSignInOut } from "./ClerkSignInOut";
import { APP_NAME } from "@/lib/constants";
// import ModeToggle from "./ModeToggle";
import Menu from "./Menu";
// import { useShallow } from 'zustand/shallow';

type HeaderProps = {
  // user?: Omit<User, "passwordHash"> | null;
  categorySelector?: React.ReactNode;
};

const Header = ({ categorySelector }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [prevScrollY, setPrevScrollY] = useState<number>(0);

  // const { open, getTotalItems } = useCartStore(
  //     useShallow((state) => ({
  //         open: state.open,
  //         getTotalItems: state.getTotalItems
  //     }))
  // );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolledUp = currentScrollY < prevScrollY;

      if (scrolledUp) {
        setIsOpen(true);
      } else if (currentScrollY > 100) {
        setIsOpen(false);
      }

      setPrevScrollY(currentScrollY);
    };

    setPrevScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  return (
    <header className="w-full sticky top-0 z-50">
      <div
        className={clsx(
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <Announcements />

        <div className="w-full flex justify-between items-center py-3 sm:py-4 bg-white/60 shadow-sm border-b border-gray-100 backdrop-blur-sm">
          <div className="flex justify-between items-center container mx-auto px-8">
            <div className="flex flex-1 justify-start items-center gap-4 sm:gap-6">
              <button className="text-gray-700 hover:text-gray-900 md:hidden">
                <HiMenu className="size-6" />
              </button>

              <nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium">
                {categorySelector}
              </nav>
            </div>

            <Link
              href="/"
              className="hidden sm:flex absolute left-1/3 -translate-x-1/2"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {APP_NAME}
              </span>
            </Link>

            <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
              <HeaderSearchBar />

              {/* <div className="flex justify-start items-center gap-4 sm:gap-6">
                <button className="text-gray-700 hover:text-gray-900 md:hidden">
                  <HiOutlineDotsHorizontal className="size-6" />
                </button>

                <div className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium">
                  <ModeToggle />
                  <ClerkSignInOut />

                  <button className="text-gray-700 hover:text-gray-900 relative">
                    <HiOutlineShoppingBag className="size-6" />
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                      {0}
                    </span>
                  </button>
                </div>
              </div> */}

              <Menu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
