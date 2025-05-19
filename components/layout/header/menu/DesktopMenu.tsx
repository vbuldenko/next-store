import ModeToggle from "../ModeToggle";
import CartIndicator from "./CartIndicator";
import { ServerUserButton } from "@/components/auth/ServerUserButton";

const DesktopMenu = () => {
  return (
    <nav className="hidden md:flex w-full max-w-xs gap-1">
      <ModeToggle />

      <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-medium">
        <ServerUserButton />
        <CartIndicator />
      </div>
    </nav>
  );
};

export default DesktopMenu;
