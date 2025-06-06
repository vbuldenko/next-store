import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md",
        secondary:
          "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        success:
          "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        warning:
          "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
        glass:
          "bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 hover:bg-white/30 shadow-lg",
        neon: "bg-black text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black shadow-lg hover:shadow-cyan-400/50 transform hover:scale-[1.02]",
        minimal:
          "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99]",

        // Premium gradients
        sunset:
          "bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:from-pink-600 hover:to-orange-500 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        ocean:
          "bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]",
        emerald:
          "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]",
        royal:
          "bg-gradient-to-r from-purple-800 via-violet-700 to-purple-800 text-white hover:from-purple-700 hover:via-violet-600 hover:to-purple-700 shadow-lg hover:shadow-purple-800/50 transform hover:scale-[1.02] active:scale-[0.98]",

        rose: "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-lg hover:shadow-rose-500/50 transform hover:scale-[1.02] active:scale-[0.98]",

        // Special effects
        rainbow:
          "bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] animate-pulse",
        shimmer:
          "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] text-white hover:bg-[position:100%_0] shadow-md hover:shadow-purple-600/50 transform active:scale-[0.98] transition-all duration-500",
      },
      size: {
        xs: "h-6 px-2 text-xs rounded-md",
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        xxl: "h-16 px-10 text-xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

const Button = ({ className, variant, size, ref, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
};

Button.displayName = "Button";

export { Button, buttonVariants };
