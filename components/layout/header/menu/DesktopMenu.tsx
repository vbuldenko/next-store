import ModeToggle from "../ModeToggle";
import SignInOutButton from "@/components/auth/SignInOutButton";
import CartIndicator from "./CartIndicator";

const DesktopMenu = () => {
  return (
    <nav className="hidden md:flex w-full max-w-xs gap-1">
      <ModeToggle />

      <div className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-medium">
        <SignInOutButton />
        <CartIndicator count={0} />
      </div>
    </nav>
  );
};

export default DesktopMenu;
