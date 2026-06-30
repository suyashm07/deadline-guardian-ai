import type { ReactNode } from "react";

import { GlassPanel } from "./ui/GlassPanel";

type EmptyPlaceholderProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

function DefaultIcon() {
  return (
    <svg
      className="h-6 w-6 text-muted"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    </svg>
  );
}

export function EmptyPlaceholder({
  title,
  description,
  icon,
}: EmptyPlaceholderProps) {
  return (
    <GlassPanel
      padding="lg"
      className="premium-card flex min-h-[280px] flex-col items-center justify-center text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface shadow-[0_0_24px_rgba(94,234,212,0.08)]">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
        {description}
      </p>
    </GlassPanel>
  );
}
