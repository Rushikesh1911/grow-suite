// src/components/layout/layout.tsx
import { ReactNode, useEffect } from "react";
import Head from "next/head";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({
  children,
  title = "GrowSuite - All-in-One Freelancer CRM",
  description = "GrowSuite helps freelancers manage clients, projects, and payments in one place. Start your free trial today."
}: LayoutProps) {
  // Ensure the theme is applied to the root HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // Set initial theme class
    root.classList.remove('light', 'dark');
    root.classList.add(systemTheme);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </div>
  );
}