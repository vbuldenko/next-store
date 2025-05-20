"use client";
import { useState } from "react";
import { motion } from "framer-motion";

// Configuration options for the ripple effect
export interface RippleConfig {
  size?: number; // Size of the ripple in pixels
  duration?: number; // Animation duration in seconds
  color?: string; // Color of the ripple
  blur?: number; // Blur amount in pixels
  scale?: number; // Final scale of the ripple
  opacity?: number; // Initial opacity
  shadow?: string; // Optional box shadow
  disabled?: boolean; // Disable ripple effect
}

interface RippleWrapperProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  options?: RippleConfig;
  component?: "button" | "div"; // Allow choosing the wrapper element
}

export default function MotionRippleWrapper({
  children,
  options = {},
  component = "button",
  className = "",
  onClick,
  ...props
}: RippleWrapperProps) {
  // Default configuration with your preset values
  const config = {
    size: 120,
    duration: 0.6,
    color: "rgba(255, 255, 255, 0.3)",
    blur: 10,
    scale: 2.5,
    opacity: 0.8,
    shadow: "0 0 20px rgba(255, 255, 255, 0.2)",
    disabled: false,
    ...options,
  };

  // Track ripples
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  // Handle click event
  const handleClick = (e: React.MouseEvent) => {
    // Skip if disabled
    if (config.disabled) {
      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      return;
    }

    // Calculate position relative to the clicked element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add new ripple
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);

    // Call original onClick
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };

  // Remove ripple when animation completes
  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  // Render the appropriate component (button or div)
  const Component = component as React.ElementType;

  return (
    <Component
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}

      {/* Render all active ripples */}
      {ripples.map(({ id, x, y }) => (
        <motion.span
          key={id}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: config.size,
            height: config.size,
            left: x - config.size / 2,
            top: y - config.size / 2,
            backgroundColor: config.color,
            filter: `blur(${config.blur}px)`,
            boxShadow: config.shadow,
          }}
          initial={{ scale: 0, opacity: config.opacity }}
          animate={{ scale: config.scale, opacity: 0 }}
          transition={{ duration: config.duration, ease: "easeOut" }}
          onAnimationComplete={() => removeRipple(id)}
        />
      ))}
    </Component>
  );
}
