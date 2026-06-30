"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

import { useMission } from "./MissionContext";

function formatSubtitle(missionName?: string, deadline?: string) {
  if (!missionName && !deadline) {
    return "Research paper · Due Jun 28, 2026";
  }

  const formattedDeadline = deadline
    ? new Date(`${deadline}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Jun 28, 2026";

  return `${missionName ?? "Research paper"} · Due ${formattedDeadline}`;
}

export function CommandBar() {
  const { mission, searchQuery, setSearchQuery, resetMission } = useMission();
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim lg:hidden">
          <div className="h-2 w-2 rounded-full bg-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight sm:text-[15px]">
              Deadline Command Center
            </h1>
            <span className="hidden rounded-md bg-emerald-dim px-2 py-0.5 text-[10px] font-medium text-emerald sm:inline">
              LIVE
            </span>
          </div>
          <p className="text-[11px] text-muted">
            {formatSubtitle(mission?.missionName, mission?.deadline)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 sm:flex">
          <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search missions..."
            className="w-36 bg-transparent text-xs text-foreground outline-none transition-colors placeholder:text-muted focus-visible:ring-0"
            aria-label="Search missions"
          />
          <kbd
            className="cursor-pointer rounded border border-border bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] text-muted"
            onClick={() => searchInputRef.current?.focus()}
          >
            ⌘K
          </kbd>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={resetMission}
          className="btn-primary rounded-lg px-3.5 py-2 text-xs transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 sm:text-[13px]"
        >
          + New mission
        </motion.button>
      </div>
    </header>
  );
}
