import ModeToggle from "../ModeToggle";
import CartIndicator from "./CartIndicator";
import { ServerSignInOutButton } from "@/components/auth/ServerSignInOutButton";

const DesktopMenu = () => {
  return (
    <nav className="hidden md:flex w-full max-w-xs gap-1">
      <ModeToggle />

      <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-medium">
        <ServerSignInOutButton />
        <CartIndicator count={0} />
      </div>
    </nav>
  );
};

export default DesktopMenu;
