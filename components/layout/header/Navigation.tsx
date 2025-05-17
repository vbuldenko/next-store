import { HiMenu } from "react-icons/hi";
import { Logo } from "./Logo";
import HeaderSearchBar from "./SearchBar";
import DesktopMenu from "./menu/DesktopMenu";
import { MobileMenuToggle } from "./menu/MobileMenuToggle";
import HeaderCategorySelector from "./CategorySelector";

export default function Navigation() {
  return (
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
            <HeaderCategorySelector />
          </div>
        </div>

        {/* Center section: Logo & search */}
        <div className="flex items-center justify-center">
          <Logo />
          <HeaderSearchBar />
        </div>

        {/* Right section: Mobile menu toggle & desktop menu */}
        <div className="flex gap-3">
          <DesktopMenu />
          <MobileMenuToggle />
        </div>
      </div>
    </nav>
  );
}
