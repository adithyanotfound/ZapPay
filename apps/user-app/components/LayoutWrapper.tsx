"use client";

import { usePathname } from "next/navigation";
import { AppbarClient } from "./AppbarClient";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  return (
    <div className="min-w-screen min-h-screen bg-[#ebe6e6]">
      {!isAuthRoute && <AppbarClient />}
      {children}
    </div>
  );
}