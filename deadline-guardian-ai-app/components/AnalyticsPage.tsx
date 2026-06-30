"use client";

import { motion } from "framer-motion";

import { AnalyticsCards } from "@/components/AnalyticsCards";
import { DashboardStats } from "@/components/DashboardStats";
import { EmptyMissionState } from "@/components/EmptyMissionState";
import { useMission } from "@/components/MissionContext";
import { NoMissionsFound } from "@/components/NoMissionsFound";
import { TaskProgressPanel } from "@/components/TaskProgressPanel";
import { TimeAllocation } from "@/components/TimeAllocation";

export function AnalyticsPage() {
  const { plan, showNoMatchingMissions, history } = useMission();

  if (showNoMatchingMissions) {
    return <NoMissionsFound />;
  }

  if (history.length === 0) {
    return <EmptyMissionState />;
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <DashboardStats />
      </motion.div>

      {plan ? (
        <>
          <TaskProgressPanel />
          <AnalyticsCards plan={plan} />
          <TimeAllocation plan={plan} />
        </>
      ) : (
        <EmptyMissionState />
      )}
    </div>
  );
}
