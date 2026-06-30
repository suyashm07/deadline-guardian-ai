"use client";

import { useMission } from "@/components/MissionContext";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function TaskProgressPanel() {
  const { progressStats, plan } = useMission();

  if (!plan) {
    return null;
  }

  return (
    <GlassPanel padding="lg" className="premium-card">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-accent">
            Task Progress
          </p>
          <h3 className="mt-2 text-[15px] font-semibold">Mission execution status</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface px-3 py-2.5">
              <p className="text-[10px] text-muted">Completed</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-emerald">
                {progressStats.completedTasks}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-3 py-2.5">
              <p className="text-[10px] text-muted">Remaining</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
                {progressStats.remainingTasks}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-3 py-2.5">
              <p className="text-[10px] text-muted">Hours done</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-accent">
                {progressStats.completedHours}h
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface px-3 py-2.5">
              <p className="text-[10px] text-muted">Hours left</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-violet">
                {progressStats.remainingHours}h
              </p>
            </div>
          </div>
        </div>
        <CircularProgress percent={progressStats.progressPercent} />
      </div>
    </GlassPanel>
  );
}
