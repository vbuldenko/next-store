"use client";

import { createContext, useContext, useId } from "react";
import { BsCircleFill } from "react-icons/bs";
import { cn } from "@/lib/utils";

// ========================================
// Types & Context
// ========================================

type RadioGroupContextValue = {
  name: string;
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(
  undefined
);

// ========================================
// RadioGroup Component
// ========================================

type RadioGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

function RadioGroup({
  className,
  value,
  onValueChange,
  disabled,
  children,
  ...props
}: RadioGroupProps) {
  const name = useId();

  const contextValue: RadioGroupContextValue = {
    name,
    value,
    onValueChange: onValueChange || (() => {}),
    disabled,
  };

  return (
    <RadioGroupContext value={contextValue}>
      <div className={cn("grid gap-2", className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext>
  );
}

// ========================================
// RadioGroupItem Component
// ========================================

type RadioGroupItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  checked?: boolean;
  disabled?: boolean;
};

function RadioGroupItem({
  className,
  value,
  checked,
  disabled: itemDisabled,
  children,
  ...props
}: RadioGroupItemProps) {
  // Get context and validate
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used within RadioGroup");
  }

  // Extract context values
  const {
    name,
    value: groupValue,
    onValueChange,
    disabled: groupDisabled,
  } = context;

  // Calculate state
  const isDisabled = groupDisabled || itemDisabled;
  const isChecked = checked !== undefined ? checked : groupValue === value;
  const id = useId();

  // Event handlers
  const handleChange = () => {
    if (!isDisabled) {
      onValueChange(value);
    }
  };

  // Styles
  const containerClasses = cn(
    "flex items-center gap-2 cursor-pointer",
    isDisabled && "cursor-not-allowed opacity-50",
    className
  );

  return (
    <div className={containerClasses} onClick={handleChange} {...props}>
      <div className="relative">
        {/* Hidden native input for accessibility */}
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          className="sr-only peer"
        />

        {/* Custom radio button */}
        <div
          className={cn(
            // Base styles
            "size-4 rounded-full border",
            "flex items-center justify-center transition-all duration-200",
            // Focus styles
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2",
            // Disabled styles
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          )}
        >
          {isChecked && <BsCircleFill className="size-2 text-primary" />}
        </div>
      </div>

      {/* Label content */}
      {children}
    </div>
  );
}

export { RadioGroup, RadioGroupItem };
