import React from "react";
import { cn } from "@/lib/utils";
import { AiFillCheckCircle } from "react-icons/ai";

const steps = [
  "User Login",
  "Shipping Address",
  "Payment Method",
  "Place Order",
];

const CheckoutSteps = ({ current = 0 }) => (
  <nav className="max-w-md mx-auto md:max-w-200 mb-10">
    <div className="flex flex-col md:flex-row h-50 md:h-auto w-full justify-between md:items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "flex items-center gap-2 rounded-full p-2 transition-all duration-500 relative overflow-hidden",
              current === index &&
                "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
            )}
          >
            {/* Shimmer effect for current step */}
            {current === index && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite] -skew-x-12" />
            )}

            {/* Step icon */}
            <span
              className={cn(
                "flex items-center justify-center size-5 rounded-full border-2 transition-all duration-500 relative z-10",
                index < current && "border-none",
                index === current && "border-white bg-white/20",
                index > current && "border-gray-300 text-gray-400"
              )}
            >
              {index < current ? (
                <AiFillCheckCircle className="text-green-500 size-5" />
              ) : index === current ? (
                <div className="size-2 bg-white rounded-full" />
              ) : null}
            </span>

            {/* Step name */}
            <span
              className={cn(
                "text-xs font-semibold transition-all duration-500 whitespace-nowrap relative z-10",
                index === current && "text-white px-2",
                index < current && "text-green-600 font-bold",
                index > current && "text-gray-400"
              )}
            >
              {step}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="mx-4 flex-1 border-dashed border-black/20 w-px h-8 md:w-8 md:h-px border-l-2 md:border-l-0 md:border-t-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  </nav>
);

export default CheckoutSteps;
