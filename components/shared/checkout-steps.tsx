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
  <nav className="w-full mb-10">
    <div className="flex flex-col md:flex-row h-50 md:h-auto w-full justify-between md:items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn("flex items-center gap-2", {
              "bg-black p-2 rounded-full": current === index,
            })}
          >
            {/* Step icon */}
            {/* <span
              className={cn(
                "size-5 rounded-full border-2 transition-all duration-300",
                index < current
                  ? "border-none"
                  : "border-gray-300 text-gray-400"
              )}
            > */}
            {index < current && (
              <AiFillCheckCircle className="text-green-500 size-5" />
            )}
            {/* </span> */}
            {/* Step name */}
            <span
              className={cn(
                "text-xs font-semibold transition-colors duration-300 whitespace-nowrap",
                index === current
                  ? "text-white px-2"
                  : index < current
                  ? "text-black/70"
                  : "text-gray-400"
              )}
            >
              {step}
            </span>
          </div>
          {/* Connector line: vertical on mobile, horizontal on desktop */}
          {index !== steps.length - 1 && (
            <div
              className={cn(
                "mx-2 flex-1 border-dashed border-black/20",
                "w-px h-8 md:w-8 md:h-px",
                "border-l-2 md:border-l-0 md:border-t-2"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  </nav>
);

export default CheckoutSteps;
