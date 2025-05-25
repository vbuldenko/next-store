import { useRef } from "react";

export type RippleOrigin =
  | "center"
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "cursor";

export type RippleShape = "circle" | "ellipse";

export interface RippleOptions {
  color?: string;
  size?: number;
  duration?: number;
  opacity?: number;
  disabled?: boolean;
  scale?: number;
  blur?: number;
  origin?: RippleOrigin;
  shape?: RippleShape;
  aspectRatio?: number;
  rotation?: number;
}

const defaultOptions: RippleOptions = {
  color: "rgba(255, 255, 255, 0.2)",
  size: 120,
  duration: 600,
  opacity: 0.8,
  disabled: false,
  scale: 4,
  blur: 10,
  origin: "cursor",
  shape: "circle",
  aspectRatio: 2,
  rotation: 0,
};

const getEffectiveColor = (color?: string): string => {
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "dark";
  return (
    color ||
    (isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)")
  );
};

const createRippleAnimation = (
  animationName: string,
  rotationTransform: string,
  options: RippleOptions
): HTMLStyleElement => {
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
  return style;
};

const setupContainerStyles = (container: HTMLElement) => {
  const containerStyle = getComputedStyle(container);
  if (containerStyle.position === "static") {
    container.style.position = "relative";
  }
  if (containerStyle.overflow !== "hidden") {
    container.style.overflow = "hidden";
  }
};

const computeRipplePosition = (
  e: React.MouseEvent,
  rect: DOMRect,
  origin: RippleOrigin
): { x: number; y: number } => {
  switch (origin) {
    case "center":
      return { x: rect.width / 2, y: rect.height / 2 };
    case "left":
      return { x: 0, y: rect.height / 2 };
    case "right":
      return { x: rect.width, y: rect.height / 2 };
    case "top":
      return { x: rect.width / 2, y: 0 };
    case "bottom":
      return { x: rect.width / 2, y: rect.height };
    case "cursor":
    default:
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
};

const computeRippleDimensions = (
  options: RippleOptions
): { width: number; height: number; borderRadius: string } => {
  let width = options.size!;
  let height = options.size!;
  const borderRadius = "50%";

  if (options.shape === "ellipse") {
    width = options.size! * options.aspectRatio!;
    height = options.size!;
  }

  return { width, height, borderRadius };
};

export const useRipple = (options: RippleOptions) => {
  const config = {
    ...defaultOptions,
    ...options,
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  const effectiveColor = getEffectiveColor(config.color);

  const createRipple = (e: React.MouseEvent) => {
    if (config.disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const { x, y } = computeRipplePosition(e, rect, config.origin!);

    const { width, height, borderRadius } = computeRippleDimensions(config);

    const ripple = document.createElement("span");
    const animationName = `ripple-${Date.now()}`;
    const rotationTransform =
      config.shape === "ellipse" && config.rotation
        ? `rotate(${config.rotation}deg)`
        : "";

    const style = createRippleAnimation(
      animationName,
      rotationTransform,
      config
    );

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
      animation: ${animationName} ${config.duration}ms ease-out;
      filter: blur(${config.blur}px);
      -webkit-filter: blur(${config.blur}px);
    `;

    container.appendChild(ripple);
    setupContainerStyles(container);

    setTimeout(() => {
      ripple.remove();
      style.remove();
    }, config.duration);
  };

  return { containerRef, createRipple };
};
