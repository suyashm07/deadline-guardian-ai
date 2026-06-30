"use client";

import { motion } from "framer-motion";

import { useMission } from "@/components/MissionContext";
import { GlassPanel } from "@/components/ui/GlassPanel";

const statConfig = [
  { key: "totalMissions", label: "Total Missions", format: (v: number) => `${v}`, color: "text-accent", bg: "bg-accent-dim" },
  { key: "activeMissions", label: "Active Missions", format: (v: number) => `${v}`, color: "text-electric", bg: "bg-electric-dim" },
  { key: "completedMissions", label: "Completed Missions", format: (v: number) => `${v}`, color: "text-emerald", bg: "bg-emerald-dim" },
  { key: "averageCompletionPercent", label: "Average Completion %", format: (v: number) => `${v}%`, color: "text-violet", bg: "bg-violet-dim" },
  { key: "averageRiskLevel", label: "Average Risk", format: (v: string) => v, color: "text-amber", bg: "bg-amber-dim" },
  { key: "hoursPlanned", label: "Planned Hours", format: (v: number) => `${v}h`, color: "text-accent", bg: "bg-accent-dim" },
  { key: "completedHours", label: "Completed Hours", format: (v: number) => `${v}h`, color: "text-emerald", bg: "bg-emerald-dim" },
  { key: "remainingHours", label: "Remaining Hours", format: (v: number) => `${v}h`, color: "text-violet", bg: "bg-violet-dim" },
  { key: "averageDailyHours", label: "Average Daily Hours", format: (v: number) => `${v}h`, color: "text-electric", bg: "bg-electric-dim" },
] as const;

export function DashboardStats() {
  const { statistics } = useMission();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
      {statConfig.map((stat, index) => {
        const rawValue = statistics[stat.key];
        const displayValue =
          stat.key === "averageRiskLevel"
            ? stat.format(rawValue as string)
            : stat.format(rawValue as number);

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="group"
          >
            <GlassPanel
              subtle
              padding="sm"
              className="premium-card h-full transition-all duration-300 group-hover:border-accent/20"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] text-muted">{stat.label}</p>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${stat.bg} ${stat.color}`}
                >
                  Live
                </span>
              </div>
              <p
                className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${stat.color}`}
              >
                {displayValue}
              </p>
            </GlassPanel>
          </motion.div>
        );
      })}
    </div>
  );
}
