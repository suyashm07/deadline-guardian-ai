"use client";

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

export function CommandCenter() {
  return (
    <div className="relative flex min-h-screen os-bg">
      <CommandBackground />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <CommandBar />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-[1400px] space-y-4">
              {/* Top row: countdown + risk */}
              <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                <CountdownWidget />
                <RiskRadar />
              </div>

              {/* Analytics strip */}
              <AnalyticsCards />

              {/* AI Guardian recommendations */}
              <GuardianRecommendations />

              {/* AI Timeline — full width */}
              <AITimeline />

              {/* Bottom row: allocation + composer */}
              <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
                <TimeAllocation />
                <MissionComposer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
