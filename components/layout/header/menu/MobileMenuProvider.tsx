"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MobileMenuContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const MobileMenuContext = createContext<MobileMenuContextType>({
  isOpen: false,
  toggle: () => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <MobileMenuContext value={{ isOpen, toggle }}>{children}</MobileMenuContext>
  );
}
