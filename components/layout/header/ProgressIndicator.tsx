"use client";

import { useState, useEffect } from "react";

export default function ProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Only run on client-side
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;

      // Avoid division by zero and calculate progress
      const progress = scrollHeight > 0 ? currentScrollY / scrollHeight : 0;
      setScrollProgress(progress);
    };

    // Set initial value
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 h-1">
      <div
        className="bg-gray-400 h-full transition-transform duration-300"
        style={{
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}
