import { useRef } from "react";

// Origin options for the ripple effect
export type RippleOrigin =
  | "center"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "cursor";

// Shape options for the ripple effect
export type RippleShape = "circle" | "ellipse";

// Options for customizing the ripple effect
export interface RippleOptions {
  color?: string; // Ripple color (CSS color value)
  size?: number; // Ripple diameter in pixels
  duration?: number; // Animation duration in milliseconds
  opacity?: number; // Ripple opacity (0-1)
  centered?: boolean; // DEPRECATED: Use origin instead
  disabled?: boolean; // Whether ripple effect is enabled
  scale?: number; // Final scale of the ripple (1 = no scaling, 2 = double size, etc.)
  blur?: number; // Blur amount in pixels
  origin?: RippleOrigin; // Where the ripple starts from
  shape?: RippleShape; // Shape of the ripple effect
  aspectRatio?: number; // Width-to-height ratio for ellipse (default: 2)
  rotation?: number; // Rotation angle in degrees for ellipse (default: 0)
}

// Default options
const defaultOptions: RippleOptions = {
  color: "rgba(255, 255, 255, 0.2)",
  size: 120,
  duration: 600,
  opacity: 0.8,
  disabled: false,
  scale: 4, // Default scale factor
  blur: 10, // Default blur amount in pixels
  origin: "cursor", // Default to cursor position
  shape: "circle", // Default shape
  aspectRatio: 2, // Default aspect ratio for ellipse (width = 2 * height)
  rotation: 0, // Default rotation angle in degrees
};

export const useRipple = (customOptions: RippleOptions = {}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Merge default options with custom options
  // Handle backward compatibility with centered prop
  const options = {
    ...defaultOptions,
    ...customOptions,
    // If centered is true, override origin to be "center"
    origin: customOptions.centered
      ? "center"
      : customOptions.origin || defaultOptions.origin,
  };

  // Get the theme-specific color
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";

  const effectiveColor =
    options.color ||
    (isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)");

  const createRipple = (e: React.MouseEvent) => {
    // Skip if disabled
    if (options.disabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Calculate position
    const rect = container.getBoundingClientRect();

    // Determine ripple start position based on origin
    let x: number, y: number;

    switch (options.origin) {
      case "center":
        x = rect.width / 2;
        y = rect.height / 2;
        break;
      case "left":
        x = 0;
        y = rect.height / 2;
        break;
      case "right":
        x = rect.width;
        y = rect.height / 2;
        break;
      case "top":
        x = rect.width / 2;
        y = 0;
        break;
      case "bottom":
        x = rect.width / 2;
        y = rect.height;
        break;
      case "cursor":
      default:
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        break;
    }

    // Calculate dimensions based on shape
    let width = options.size!;
    let height = options.size!;
    let borderRadius = "50%";

    if (options.shape === "ellipse") {
      // For ellipse, apply aspect ratio
      width = options.size! * options.aspectRatio!;
      height = options.size!;
      borderRadius = "50%"; // Still 50% for ellipse
    }

    // Create the ripple element
    const ripple = document.createElement("span");

    // Create a unique animation name for this ripple
    const animationName = `ripple-${Date.now()}`;

    // Create rotation transform if needed
    const rotationTransform =
      options.shape === "ellipse" && options.rotation
        ? `rotate(${options.rotation}deg)`
        : "";

    // Create and inject the keyframes
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes ${animationName} {
          0% {
            transform: scale(0) ${rotationTransform};
            opacity: ${options.opacity};
          }
          100% {
            transform: scale(${options.scale}) ${rotationTransform};
            opacity: 0;
          }
        }
    `;
    document.head.appendChild(style);

    // Apply styles based on shape
    ripple.style.cssText = `
      position: absolute;
      pointer-events: none;
      border-radius: ${borderRadius};
      background: ${effectiveColor};
      width: ${width}px;
      height: ${height}px;
      left: ${x - width / 2}px;
      top: ${y - height / 2}px;
      transform: scale(0) ${rotationTransform};
      animation: ${animationName} ${options.duration}ms ease-out;
      filter: blur(${options.blur}px);
      -webkit-filter: blur(${options.blur}px);
    `;

    // Add the ripple to the container
    container.appendChild(ripple);

    // Make sure container has position relative and overflow hidden
    const containerStyle = getComputedStyle(container);
    if (containerStyle.position === "static") {
      container.style.position = "relative";
    }
    if (containerStyle.overflow !== "hidden") {
      container.style.overflow = "hidden";
    }

    // Clean up the ripple and style after animation completes
    setTimeout(() => {
      ripple.remove();
      style.remove();
    }, options.duration);
  };

  return { containerRef, createRipple };
};
