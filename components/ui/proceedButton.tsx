"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PiSpinner } from "react-icons/pi";
import { AiOutlineArrowRight } from "react-icons/ai";

interface Props {
  text: string;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  iconSize?: string;
  spinnerClassName?: string;
  onClick?: () => void;
  [key: string]: any; // For all other button props
}

export default function ProceedButton({
  text,
  isLoading = false,
  loadingText,
  className = "",
  icon,
  iconPosition = "left",
  iconSize = "size-4",
  spinnerClassName = "",
  onClick,
  ...props
}: Props) {
  const displayText = isLoading && loadingText ? loadingText : text;

  const displayIcon = icon || <AiOutlineArrowRight className={iconSize} />;

  return (
    <Button
      className={cn("flex items-center gap-2", className)}
      disabled={isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <PiSpinner
          className={cn(iconSize, "animate-spin", spinnerClassName)}
          aria-hidden="true"
        />
      )}

      {!isLoading && iconPosition === "left" && displayIcon}

      <span>{displayText}</span>

      {!isLoading && iconPosition === "right" && displayIcon}
    </Button>
  );
}
