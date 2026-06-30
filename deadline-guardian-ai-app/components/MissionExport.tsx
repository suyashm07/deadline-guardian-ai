"use client";

import { motion } from "framer-motion";

import { useMission } from "@/components/MissionContext";
import {
  exportMissionJson,
  exportMissionPdf,
  printMission,
} from "@/lib/mission-export";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function MissionExport() {
  const { activeEntry } = useMission();

  if (!activeEntry) {
    return null;
  }

  return (
    <GlassPanel padding="md" className="premium-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
            Export
          </p>
          <p className="mt-1 text-sm text-muted">
            Download or print the active mission plan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => exportMissionJson(activeEntry)}
            className="btn-ghost rounded-lg px-3.5 py-2 text-xs"
          >
            Export JSON
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => exportMissionPdf(activeEntry)}
            className="btn-ghost rounded-lg px-3.5 py-2 text-xs"
          >
            Export PDF
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => printMission(activeEntry)}
            className="btn-primary rounded-lg px-3.5 py-2 text-xs"
          >
            Print Mission
          </motion.button>
        </div>
      </div>
    </GlassPanel>
  );
}
