"use client";

import type { ReactNode } from "react";

import { CommandBackground } from "./CommandBackground";
import { CommandBar } from "./CommandBar";
import { Sidebar } from "./Sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen os-bg">
      <CommandBackground />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <CommandBar />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-[1400px] space-y-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
