import ModeToggle from "../layout/header/ModeToggle";
import CartIndicator from "../layout/header/menu/CartIndicator";
import { ServerUserButton } from "../auth/ServerUserButton";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <CartIndicator />
        <ServerUserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <HiOutlineDotsHorizontal className="size-6" />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <CartIndicator />
            <ServerUserButton />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
