"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * The applied theme lives on <html>, put there by the blocking script in
 * <head> before first paint. That class is the source of truth; React
 * subscribes to it rather than resolving the theme a second time, which is
 * what previously caused a flash of the wrong theme on load.
 */
let listeners: (() => void)[] = [];

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// No DOM on the server; the script corrects this before anything is painted.
function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", nextTheme);

    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced) {
      // Ease the change across every surface. An abrupt brightness jump across
      // the whole viewport is jarring; the class is transient so the transition
      // never sits on top of normal interaction.
      root.classList.add("theme-changing");
      window.setTimeout(() => root.classList.remove("theme-changing"), 420);
    }

    root.classList.toggle("dark", nextTheme === "dark");
    listeners.forEach((listener) => listener());
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
