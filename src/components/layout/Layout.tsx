import { Toaster } from "sonner";
import { useEffect } from "react";
import { initializeSounds } from "@/lib/sounds";

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
