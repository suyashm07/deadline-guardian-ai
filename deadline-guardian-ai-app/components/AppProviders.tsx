"use client";

import { MissionProvider } from "./MissionContext";
import { ToastProvider } from "./ui/Toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <MissionProvider>{children}</MissionProvider>
    </ToastProvider>
  );
}
