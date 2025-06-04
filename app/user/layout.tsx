import { Logo } from "@/components/layout/header/Logo";
import MainNav from "@/components/shared/MainNav";
// import Menu from "@/components/shared/menu";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Logo />
            <MainNav className="mx-6" />
            <div className="ml-auto items-center flex space-x-4">
              {/* <Menu /> */}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
