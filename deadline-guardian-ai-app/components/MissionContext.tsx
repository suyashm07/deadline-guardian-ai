"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  GeneratedPlan,
  MissionHistoryEntry,
  MissionInput,
  MissionProgress,
} from "./generated-plan";
import { filterMissionHistory } from "@/lib/mission-search";
import {
  computeDeadlineWarning,
  computeMissionProgress,
  createEmptyProgress,
  getTaskId,
  getTodaysFocus,
  type DeadlineWarning,
  type MissionProgressStats,
  type TodaysFocus,
} from "@/lib/mission-progress";
import {
  computeDashboardStatistics,
  type DashboardStatistics,
} from "@/lib/mission-stats";
import {
  createMissionId,
  loadMissionHistory,
  persistMissionHistory,
} from "@/lib/mission-storage";
import { useToast } from "@/components/ui/Toast";

type MissionContextValue = {
  plan: GeneratedPlan | null;
  mission: MissionInput | null;
  activeMissionId: string | null;
  activeEntry: MissionHistoryEntry | null;
  activeProgress: MissionProgress;
  progressStats: MissionProgressStats;
  todaysFocus: TodaysFocus | null;
  deadlineWarning: DeadlineWarning | null;
  history: MissionHistoryEntry[];
  filteredHistory: MissionHistoryEntry[];
  recentMissions: MissionHistoryEntry[];
  statistics: DashboardStatistics;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  composerResetKey: number;
  generationRevealKey: number;
  handlePlanGenerated: (plan: GeneratedPlan, missionInput: MissionInput) => void;
  loadMission: (entry: MissionHistoryEntry) => void;
  deleteMission: (id: string) => void;
  clearHistory: () => void;
  resetMission: () => void;
  toggleTaskComplete: (taskId: string) => void;
  showNoMatchingMissions: boolean;
  showActiveDashboard: boolean;
};

const MissionContext = createContext<MissionContextValue | null>(null);

function sortHistory(entries: MissionHistoryEntry[]) {
  return [...entries].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function MissionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [history, setHistory] = useState<MissionHistoryEntry[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return loadMissionHistory();
  });
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [mission, setMission] = useState<MissionInput | null>(null);
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composerResetKey, setComposerResetKey] = useState(0);
  const [generationRevealKey, setGenerationRevealKey] = useState(0);

  const updateHistory = useCallback((updater: (prev: MissionHistoryEntry[]) => MissionHistoryEntry[]) => {
    setHistory((previous) => {
      const next = sortHistory(updater(previous));
      persistMissionHistory(next);
      return next;
    });
  }, []);

  const activeEntry = useMemo(
    () => history.find((entry) => entry.id === activeMissionId) ?? null,
    [activeMissionId, history]
  );

  const activeProgress = activeEntry?.progress ?? createEmptyProgress();

  const progressStats = useMemo(
    () =>
      plan
        ? computeMissionProgress(plan, activeProgress)
        : {
            progressPercent: 0,
            completedTasks: 0,
            remainingTasks: 0,
            totalTasks: 0,
            completedHours: 0,
            remainingHours: 0,
            isFullyComplete: false,
          },
    [activeProgress, plan]
  );

  const todaysFocus = useMemo(() => {
    if (!plan || !mission) {
      return null;
    }

    return getTodaysFocus(plan, activeProgress, mission);
  }, [activeProgress, mission, plan]);

  const deadlineWarning = useMemo(() => {
    if (!plan || !mission) {
      return null;
    }

    return computeDeadlineWarning(mission, plan, activeProgress);
  }, [activeProgress, mission, plan]);

  const loadMission = useCallback(
    (entry: MissionHistoryEntry) => {
      setPlan(entry.plan);
      setMission(entry.mission);
      setActiveMissionId(entry.id);
      router.push("/");
      showToast({
        title: "Mission opened",
        message: entry.mission.missionName,
        variant: "info",
      });
    },
    [router, showToast]
  );

  const handlePlanGenerated = useCallback(
    (generatedPlan: GeneratedPlan, missionInput: MissionInput) => {
      const entry: MissionHistoryEntry = {
        id: createMissionId(),
        mission: missionInput,
        plan: generatedPlan,
        progress: createEmptyProgress(),
        createdAt: new Date().toISOString(),
      };

      updateHistory((previous) => [entry, ...previous]);
      setPlan(generatedPlan);
      setMission(missionInput);
      setActiveMissionId(entry.id);
      setGenerationRevealKey((key) => key + 1);

      showToast({
        title: "Mission Generated",
        message: "Your AI mission plan is ready.",
        variant: "success",
      });
      showToast({
        title: "Mission Saved",
        message: "Added to mission history.",
        variant: "info",
      });
    },
    [showToast, updateHistory]
  );

  const toggleTaskComplete = useCallback(
    (taskId: string) => {
      if (!activeMissionId || !plan || !activeEntry) {
        return;
      }

      const wasCompleted = activeEntry.progress.completedTaskIds.includes(taskId);

      updateHistory((previous) =>
        previous.map((entry) => {
          if (entry.id !== activeMissionId) {
            return entry;
          }

          const isCompleted = entry.progress.completedTaskIds.includes(taskId);
          const completedTaskIds = isCompleted
            ? entry.progress.completedTaskIds.filter((id) => id !== taskId)
            : [...entry.progress.completedTaskIds, taskId];

          return {
            ...entry,
            progress: { completedTaskIds },
          };
        })
      );

      if (!wasCompleted) {
        showToast({
          title: "Task Completed",
          message: "Progress updated and saved.",
          variant: "success",
        });
      }
    },
    [activeEntry, activeMissionId, plan, showToast, updateHistory]
  );

  const deleteMission = useCallback(
    (id: string) => {
      updateHistory((previous) => previous.filter((entry) => entry.id !== id));

      if (activeMissionId === id) {
        setPlan(null);
        setMission(null);
        setActiveMissionId(null);
      }

      showToast({
        title: "Mission Deleted",
        variant: "info",
      });
    },
    [activeMissionId, showToast, updateHistory]
  );

  const clearHistory = useCallback(() => {
    persistMissionHistory([]);
    setHistory([]);
    setPlan(null);
    setMission(null);
    setActiveMissionId(null);

    showToast({
      title: "History Cleared",
      message: "All mission history has been removed.",
      variant: "info",
    });
  }, [showToast]);

  const resetMission = useCallback(() => {
    setPlan(null);
    setMission(null);
    setActiveMissionId(null);
    setSearchQuery("");
    setComposerResetKey((key) => key + 1);
    router.push("/");
  }, [router]);

  const filteredHistory = useMemo(
    () => filterMissionHistory(history, searchQuery),
    [history, searchQuery]
  );

  const recentMissions = useMemo(() => history.slice(0, 5), [history]);

  const statistics = useMemo(
    () => computeDashboardStatistics(history),
    [history]
  );

  const showNoMatchingMissions = useMemo(() => {
    const query = searchQuery.trim();

    return query.length > 0 && filteredHistory.length === 0;
  }, [filteredHistory.length, searchQuery]);

  const showActiveDashboard = useMemo(() => {
    const query = searchQuery.trim();

    if (!query) {
      return true;
    }

    if (!activeMissionId) {
      return false;
    }

    return filteredHistory.some((entry) => entry.id === activeMissionId);
  }, [activeMissionId, filteredHistory, searchQuery]);

  const value = useMemo(
    () => ({
      plan,
      mission,
      activeMissionId,
      activeEntry,
      activeProgress,
      progressStats,
      todaysFocus,
      deadlineWarning,
      history,
      filteredHistory,
      recentMissions,
      statistics,
      searchQuery,
      setSearchQuery,
      composerResetKey,
      generationRevealKey,
      handlePlanGenerated,
      loadMission,
      deleteMission,
      clearHistory,
      resetMission,
      toggleTaskComplete,
      showNoMatchingMissions,
      showActiveDashboard,
    }),
    [
      plan,
      mission,
      activeMissionId,
      activeEntry,
      activeProgress,
      progressStats,
      todaysFocus,
      deadlineWarning,
      history,
      filteredHistory,
      recentMissions,
      statistics,
      searchQuery,
      composerResetKey,
      generationRevealKey,
      handlePlanGenerated,
      loadMission,
      deleteMission,
      clearHistory,
      resetMission,
      toggleTaskComplete,
      showNoMatchingMissions,
      showActiveDashboard,
    ]
  );

  return (
    <MissionContext.Provider value={value}>{children}</MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);

  if (!context) {
    throw new Error("useMission must be used within MissionProvider");
  }

  return context;
}

export { getTaskId };
