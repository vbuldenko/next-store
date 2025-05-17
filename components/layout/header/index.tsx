import Announcements from "./Announcements";
import MobileMenu from "./menu/MobileMenu";
import ProgressIndicator from "./ProgressIndicator";
import { HeaderScrollContainer } from "./HeaderScrollContainer";
import { MobileMenuProvider } from "./menu/MobileMenuProvider";
import { auth } from "@/auth";
import Navigation from "./Navigation";

const Header = async () => {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 w-full">
      <ProgressIndicator />

      <MobileMenuProvider>
        <HeaderScrollContainer>
          <Announcements />
          <Navigation />
        </HeaderScrollContainer>

        <MobileMenu session={session} />
      </MobileMenuProvider>
    </header>
  );
};

export default Header;
