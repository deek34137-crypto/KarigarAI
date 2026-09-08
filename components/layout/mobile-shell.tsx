"use client";

import React, { ReactNode } from "react";
import { Header } from "./header";
import { BottomNav } from "./bottom-nav";

interface MobileShellProps {
  children: ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
}

export function MobileShell({
  children,
  showHeader = true,
  showNav = true,
}: MobileShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 pb-20">
      {showHeader && <Header />}
      <main className="flex-1 flex flex-col">{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}
