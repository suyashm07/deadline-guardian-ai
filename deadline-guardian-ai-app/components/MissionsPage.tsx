"use client";

import { motion } from "framer-motion";

import { useMission } from "@/components/MissionContext";
import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { NoMissionsFound } from "@/components/NoMissionsFound";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { computeMissionProgress } from "@/lib/mission-progress";
import { getRiskIndicatorColor } from "@/lib/mission-stats";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCreatedAt(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MissionsPage() {
  const {
    filteredHistory,
    activeMissionId,
    showNoMatchingMissions,
    loadMission,
    deleteMission,
    clearHistory,
    history,
  } = useMission();

  if (showNoMatchingMissions) {
    return <NoMissionsFound />;
  }

  if (history.length === 0) {
    return (
      <EmptyPlaceholder
        title="No mission history yet."
        description="Generate your first AI mission plan to build your mission history."
        icon={
          <svg
            className="h-6 w-6 text-violet"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <GlassPanel padding="lg" className="premium-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-accent">
              Mission History
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">
              {filteredHistory.length} mission
              {filteredHistory.length === 1 ? "" : "s"}
            </h2>
            <p className="mt-1 text-xs text-muted">
              Open, review, or remove previously generated missions.
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={clearHistory}
            className="btn-ghost rounded-lg px-3.5 py-2 text-xs"
          >
            Clear all history
          </motion.button>
        </div>
      </GlassPanel>

      <div className="space-y-3">
        {filteredHistory.map((entry, index) => {
          const isActive = entry.id === activeMissionId;
          const progress = computeMissionProgress(entry.plan, entry.progress);

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
            >
              <GlassPanel
                padding="md"
                className={`premium-card transition-all duration-300 ${
                  isActive ? "border-accent/30 shadow-[0_0_24px_rgba(94,234,212,0.08)]" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${getRiskIndicatorColor(
                          entry.plan.riskLevel
                        )}`}
                      />
                      <h3 className="truncate text-[15px] font-semibold">
                        {entry.mission.missionName}
                      </h3>
                      {isActive ? (
                        <span className="rounded-md bg-accent-dim px-2 py-0.5 text-[10px] font-medium text-accent">
                          Active
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Due {formatDate(entry.mission.deadline)} ·{" "}
                      {entry.plan.riskLevel} risk · {entry.plan.estimatedHours}h
                      planned
                    </p>
                    <p className="mt-2 text-[11px] text-muted">
                      Created {formatCreatedAt(entry.createdAt)}
                    </p>
                    {entry.mission.description ? (
                      <p className="mt-3 line-clamp-2 text-sm text-muted">
                        {entry.mission.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-4">
                    <CircularProgress percent={progress.progressPercent} size={72} strokeWidth={6} />
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => loadMission(entry)}
                        className="btn-primary rounded-lg px-3.5 py-2 text-xs"
                      >
                        Open
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => deleteMission(entry.id)}
                        className="btn-ghost rounded-lg px-3.5 py-2 text-xs text-rose"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
