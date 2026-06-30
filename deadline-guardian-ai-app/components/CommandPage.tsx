"use client";

import { useEffect, useRef } from "react";

import { AITimeline } from "@/components/AITimeline";
import { AnalyticsCards } from "@/components/AnalyticsCards";
import { CountdownWidget } from "@/components/CountdownWidget";
import { DashboardStats } from "@/components/DashboardStats";
import { DeadlineWarning } from "@/components/DeadlineWarning";
import { GuardianRecommendations } from "@/components/GuardianRecommendations";
import { MissionComposer } from "@/components/MissionComposer";
import { MissionExport } from "@/components/MissionExport";
import { useMission } from "@/components/MissionContext";
import { NoMissionsFound } from "@/components/NoMissionsFound";
import { SelectMatchingMission } from "@/components/SelectMatchingMission";
import { RiskRadar } from "@/components/RiskRadar";
import { TaskProgressPanel } from "@/components/TaskProgressPanel";
import { TimeAllocation } from "@/components/TimeAllocation";
import { TodaysFocus } from "@/components/TodaysFocus";
import { FadeInSection } from "@/components/ui/FadeInSection";

export function CommandPage() {
  const {
    plan,
    mission,
    composerResetKey,
    generationRevealKey,
    handlePlanGenerated,
    showNoMatchingMissions,
    showActiveDashboard,
    searchQuery,
  } = useMission();

  const timelineRef = useRef<HTMLDivElement>(null);
  const prevRevealKey = useRef(generationRevealKey);

  useEffect(() => {
    if (generationRevealKey !== prevRevealKey.current && generationRevealKey > 0) {
      prevRevealKey.current = generationRevealKey;

      window.setTimeout(() => {
        timelineRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 400);
    }
  }, [generationRevealKey]);

  return (
    <>
      <FadeInSection index={0}>
        <DashboardStats />
      </FadeInSection>

      <FadeInSection index={1}>
        <MissionComposer
          key={composerResetKey}
          onPlanGenerated={handlePlanGenerated}
        />
      </FadeInSection>

      {showNoMatchingMissions ? (
        <FadeInSection index={2}>
          <NoMissionsFound />
        </FadeInSection>
      ) : !showActiveDashboard && searchQuery.trim() ? (
        <FadeInSection index={2}>
          <SelectMatchingMission />
        </FadeInSection>
      ) : (
        <>
          {plan ? (
            <>
              <FadeInSection index={2}>
                <TodaysFocus />
              </FadeInSection>
              <FadeInSection index={3}>
                <DeadlineWarning />
              </FadeInSection>
              <FadeInSection index={4}>
                <TaskProgressPanel />
              </FadeInSection>
              <FadeInSection index={5}>
                <MissionExport />
              </FadeInSection>
            </>
          ) : null}

          <FadeInSection index={6}>
            <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
              <CountdownWidget
                plan={plan}
                deadline={mission?.deadline}
                missionName={mission?.missionName}
              />
              <RiskRadar plan={plan} />
            </div>
          </FadeInSection>

          <FadeInSection index={7}>
            <AnalyticsCards plan={plan} />
          </FadeInSection>

          <FadeInSection index={8}>
            <GuardianRecommendations plan={plan} />
          </FadeInSection>

          <FadeInSection index={9} id="mission-timeline">
            <div ref={timelineRef}>
              <AITimeline plan={plan} />
            </div>
          </FadeInSection>

          <FadeInSection index={10}>
            <TimeAllocation plan={plan} />
          </FadeInSection>
        </>
      )}
    </>
  );
}
