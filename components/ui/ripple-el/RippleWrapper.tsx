"use client";
import React from "react";
import { useRipple } from "@/hooks/useRipple";

type RippleWrapperProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export default function RippleWrapper({
  children,
  className = "",
  onClick,
}: RippleWrapperProps) {
  const { containerRef, createRipple } = useRipple({
    color: "red", // Red ripple
    size: 200, // Larger ripple
    duration: 1000, // Slower animation
    centered: false, // Always ripple from center
    scale: 2, // Scale factor for the ripple
  });

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        createRipple(e);
        onClick?.(e);
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
