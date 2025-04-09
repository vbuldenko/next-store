import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="hidden sm:flex items-center justify-center">
      <span className="text-xl sm:text-2xl font-bold tracking-tight leading-none px-4">
        {APP_NAME}
      </span>
    </Link>
  );
};
