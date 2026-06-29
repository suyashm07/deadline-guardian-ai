"use client";

import { useState } from "react";

import { GuardianRecommendations } from "./GuardianRecommendations";
import { AITimeline } from "./AITimeline";
import { AnalyticsCards } from "./AnalyticsCards";
import { CommandBackground } from "./CommandBackground";
import { CommandBar } from "./CommandBar";
import { CountdownWidget } from "./CountdownWidget";
import { MissionComposer } from "./MissionComposer";
import { RiskRadar } from "./RiskRadar";
import { Sidebar } from "./Sidebar";
import { TimeAllocation } from "./TimeAllocation";
import type { GeneratedPlan, MissionInput } from "./generated-plan";

export function CommandCenter() {
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [mission, setMission] = useState<MissionInput | null>(null);

  function handlePlanGenerated(generatedPlan: GeneratedPlan, missionInput: MissionInput) {
    setPlan(generatedPlan);
    setMission(missionInput);
  }

  return (
    <div className="relative flex min-h-screen os-bg">
      <CommandBackground />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <CommandBar />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-[1400px] space-y-4">

              {/* Mission composer */}
              <MissionComposer
                onPlanGenerated={handlePlanGenerated}
              />

              {/* Top row */}
              <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                <CountdownWidget plan={plan} deadline={mission?.deadline} missionName={mission?.missionName} />
                <RiskRadar plan={plan} />
              </div>

              {/* Analytics */}
              <AnalyticsCards plan={plan} />

              {/* Guardian */}
              <GuardianRecommendations plan={plan} />

              {/* Timeline */}
              <AITimeline plan={plan} />

              {/* Bottom */}
              <TimeAllocation plan={plan} />

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
