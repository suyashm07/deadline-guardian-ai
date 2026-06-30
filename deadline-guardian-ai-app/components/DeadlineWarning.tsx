"use client";

import { motion } from "framer-motion";

import { useMission } from "@/components/MissionContext";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function DeadlineWarning() {
  const { deadlineWarning } = useMission();

  if (!deadlineWarning) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <GlassPanel
        padding="md"
        className="premium-card border-amber/25 bg-amber-dim/20"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-dim">
            <span className="text-sm" aria-hidden="true">
              ⚠
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber">
              {deadlineWarning.title}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {deadlineWarning.message}
            </p>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
