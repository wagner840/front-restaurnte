import { Toaster } from "sonner";
import React, { useEffect } from "react";
import { initializeSounds } from "@/lib/sounds";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    initializeSounds();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      {children}
    </div>
  );
}
