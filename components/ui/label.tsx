import { cn } from "@/lib/utils";
import { LabelHTMLAttributes } from "react";

const labelVariants =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

export function Label({
  className,
  htmlFor,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(labelVariants, className)}
      {...props}
    />
  );
}
