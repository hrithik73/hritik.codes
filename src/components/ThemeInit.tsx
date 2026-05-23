"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeInit() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Initialize theme from localStorage on mount
    const stored = localStorage.getItem("portfolio-theme");
    if (stored) {
      setTheme(stored as "light" | "dark" | "system");
    }
  }, [setTheme]);

  return null;
}
