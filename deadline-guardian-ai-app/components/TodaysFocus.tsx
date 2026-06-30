"use client";

import { motion } from "framer-motion";

import { useMission } from "@/components/MissionContext";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function TodaysFocus() {
  const { todaysFocus } = useMission();

  if (!todaysFocus) {
    return null;
  }

  return (
    <GlassPanel padding="lg" className="premium-card relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(56,189,248,0.12), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="inline-flex items-center gap-1.5 rounded-md bg-electric-dim px-2 py-0.5 text-[10px] font-medium text-electric"
          >
            AI Focus
          </motion.span>
          <span className="text-[10px] text-muted">{todaysFocus.day}</span>
        </div>
        <h3 className="mt-3 text-[15px] font-semibold">Today&apos;s Focus</h3>
        <p className="mt-2 text-sm leading-relaxed">{todaysFocus.task}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-surface px-2.5 py-1 font-mono text-xs tabular-nums">
            {todaysFocus.hours}h estimated
          </span>
          <p className="text-[12px] leading-relaxed text-muted">
            {todaysFocus.reason}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
