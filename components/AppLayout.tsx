"use client";

import { Suspense, useEffect, useState } from "react";
import { Sidebar } from "./SideBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "sonner";
export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const isMobile = useIsMobile();
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          !collapsed ? "ml-64" : "ml-20"
        }`}
      >
        <Toaster richColors position="top-center"/>
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
};
