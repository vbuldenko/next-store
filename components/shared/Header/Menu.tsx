import ModeToggle from "./ModeToggle";
import { HiOutlineDotsHorizontal, HiOutlineShoppingBag } from "react-icons/hi";
import { ClerkSignInOut } from "./ClerkSignInOut";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <button className="text-gray-700 hover:text-gray-900 md:hidden">
        <HiOutlineDotsHorizontal className="size-6" />
      </button>
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <div className="flex justify-start items-center gap-4 sm:gap-6">
          <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-medium">
            <ClerkSignInOut />

            <button
              // onClick={() => open()}
              className="text-gray-700 hover:text-gray-900 relative"
            >
              <HiOutlineShoppingBag className="size-6" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                {/* {getTotalItems() || 0} */}
                {0}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
