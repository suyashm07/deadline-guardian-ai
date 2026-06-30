import type { MissionHistoryEntry } from "@/components/generated-plan";
import { computeMissionProgress } from "@/lib/mission-progress";

export type DashboardStatistics = {
  totalMissions: number;
  activeMissions: number;
  completedMissions: number;
  averageCompletionPercent: number;
  averageRiskLevel: string;
  hoursPlanned: number;
  completedHours: number;
  remainingHours: number;
  averageDailyHours: number;
  highestConfidence: number;
  latestMissionDate: string | null;
};

function riskToScore(risk: string): number {
  const normalized = risk.toLowerCase();

  if (normalized === "low") {
    return 1;
  }

  if (normalized === "medium") {
    return 2;
  }

  return 3;
}

function scoreToRiskLabel(score: number): string {
  if (score <= 1.4) {
    return "Low";
  }

  if (score <= 2.4) {
    return "Medium";
  }

  return "High";
}

export function computeDashboardStatistics(
  history: MissionHistoryEntry[]
): DashboardStatistics {
  if (history.length === 0) {
    return {
      totalMissions: 0,
      activeMissions: 0,
      completedMissions: 0,
      averageCompletionPercent: 0,
      averageRiskLevel: "—",
      hoursPlanned: 0,
      completedHours: 0,
      remainingHours: 0,
      averageDailyHours: 0,
      highestConfidence: 0,
      latestMissionDate: null,
    };
  }

  const progressStats = history.map((entry) =>
    computeMissionProgress(entry.plan, entry.progress)
  );

  const hoursPlanned = history.reduce(
    (sum, entry) => sum + entry.plan.estimatedHours,
    0
  );
  const completedHours = progressStats.reduce(
    (sum, stats) => sum + stats.completedHours,
    0
  );
  const remainingHours = progressStats.reduce(
    (sum, stats) => sum + stats.remainingHours,
    0
  );

  const dailyAverages = history.map((entry) => {
    const days = Math.max(1, entry.plan.timeline.length);

    return entry.plan.estimatedHours / days;
  });

  const averageDailyHours =
    dailyAverages.reduce((sum, value) => sum + value, 0) / history.length;

  const averageCompletionPercent = Math.round(
    progressStats.reduce((sum, stats) => sum + stats.progressPercent, 0) /
      history.length
  );

  const completedMissions = progressStats.filter(
    (stats) => stats.isFullyComplete
  ).length;

  const activeMissions = history.filter((entry) => {
    const stats = computeMissionProgress(entry.plan, entry.progress);

    return !stats.isFullyComplete;
  }).length;

  const riskScores = history.map((entry) => riskToScore(entry.plan.riskLevel));
  const averageRiskScore =
    riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;

  const highestConfidence = Math.max(
    ...history.map((entry) => entry.plan.confidence)
  );

  const latestMissionDate = history.reduce((latest, entry) => {
    if (!latest) {
      return entry.createdAt;
    }

    return new Date(entry.createdAt) > new Date(latest)
      ? entry.createdAt
      : latest;
  }, history[0].createdAt);

  return {
    totalMissions: history.length,
    activeMissions,
    completedMissions,
    averageCompletionPercent,
    averageRiskLevel: scoreToRiskLabel(averageRiskScore),
    hoursPlanned: Math.round(hoursPlanned * 10) / 10,
    completedHours: Math.round(completedHours * 10) / 10,
    remainingHours: Math.round(remainingHours * 10) / 10,
    averageDailyHours: Math.round(averageDailyHours * 10) / 10,
    highestConfidence,
    latestMissionDate,
  };
}

export function getRiskIndicatorColor(riskLevel: string): string {
  const normalized = riskLevel.toLowerCase();

  if (normalized === "low") {
    return "bg-emerald";
  }

  if (normalized === "medium") {
    return "bg-amber";
  }

  return "bg-rose";
}
