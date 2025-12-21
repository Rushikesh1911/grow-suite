// src/components/layout/layout.tsx
import { useEffect } from "react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    root.classList.remove("light", "dark");
    root.classList.add(systemTheme);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
      {children}
    </div>
  );
}
