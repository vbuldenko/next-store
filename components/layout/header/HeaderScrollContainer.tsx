"use client";

import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function HeaderScrollContainer({ children }: { children: ReactNode }) {
  const isVisible = useScroll({
    threshold: 100,
    debounceTime: 50,
  });

  return (
    <div
      className={cn(
        "transform transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {children}
    </div>
  );
}
