"use client";

import { AITimeline } from "@/components/AITimeline";
import { EmptyMissionState } from "@/components/EmptyMissionState";
import { useMission } from "@/components/MissionContext";
import { NoMissionsFound } from "@/components/NoMissionsFound";
import { TaskProgressPanel } from "@/components/TaskProgressPanel";
import { TodaysFocus } from "@/components/TodaysFocus";

export function TimelinePage() {
  const { plan, showNoMatchingMissions } = useMission();

  if (showNoMatchingMissions) {
    return <NoMissionsFound />;
  }

  if (!plan) {
    return <EmptyMissionState />;
  }

  return (
    <div className="space-y-4">
      <TodaysFocus />
      <TaskProgressPanel />
      <AITimeline plan={plan} />
    </div>
  );
}
