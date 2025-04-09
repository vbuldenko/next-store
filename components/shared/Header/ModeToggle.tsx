"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Cycle through themes: light → dark → system → light...
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme("system");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center p-2"
      aria-label="Toggle theme"
    >
      {theme === "light" && <FiSun className="h-6 w-6" />}
      {theme === "dark" && <FiMoon className="h-6 w-6" />}
      {theme === "system" && <FiMonitor className="h-6 w-6" />}
    </button>
  );
};

export default ModeToggle;
