import { type ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  subtle?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-7",
};

export function GlassPanel({
  children,
  className = "",
  subtle = false,
  padding = "md",
}: GlassPanelProps) {
  return (
    <div
      className={`rounded-2xl ${subtle ? "glass-panel-subtle" : "glass-panel"} ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
