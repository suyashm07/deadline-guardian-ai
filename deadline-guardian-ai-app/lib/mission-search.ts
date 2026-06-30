import type { MissionHistoryEntry } from "@/components/generated-plan";

export function filterMissionHistory(
  history: MissionHistoryEntry[],
  query: string
): MissionHistoryEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return history;
  }

  return history.filter((entry) => {
    const mission = entry.mission;
    const plan = entry.plan;

    return (
      mission.missionName.toLowerCase().includes(normalizedQuery) ||
      mission.description.toLowerCase().includes(normalizedQuery) ||
      mission.deadline.toLowerCase().includes(normalizedQuery) ||
      plan.riskLevel.toLowerCase().includes(normalizedQuery)
    );
  });
}
