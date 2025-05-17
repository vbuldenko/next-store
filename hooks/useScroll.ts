import { useState, useEffect, useCallback } from "react";

interface HeaderScrollOptions {
  threshold?: number; // When to hide header when scrolling down
  showOnTop?: boolean; // Always show header at the top of the page
  debounceTime?: number; // Debounce time in ms
}

export function useScroll({
  threshold = 100,
  showOnTop = true,
  debounceTime = 100,
}: HeaderScrollOptions = {}) {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Memoized handler to avoid recreating on each render
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrolledUp = currentScrollY < lastScrollY;

    // Always show at the top if that option is enabled
    if (showOnTop && currentScrollY < 10) {
      setIsVisible(true);
    }
    // Show when scrolling up
    else if (scrolledUp) {
      setIsVisible(true);
    }
    // Hide when scrolling down past threshold
    else if (currentScrollY > threshold) {
      setIsVisible(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, threshold, showOnTop]);

  useEffect(() => {
    // Set initial scroll position
    setLastScrollY(window.scrollY);

    // Handle initial state
    if (showOnTop && window.scrollY < 10) {
      setIsVisible(true);
    }

    let timeoutId: NodeJS.Timeout | null = null;

    const onScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, debounceTime);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleScroll, showOnTop, debounceTime]);

  return isVisible;
}
