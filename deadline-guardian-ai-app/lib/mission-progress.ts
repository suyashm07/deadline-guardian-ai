import type { GeneratedPlan, MissionInput, MissionProgress } from "@/components/generated-plan";
import { getAvailableDays } from "@/lib/plan-utils";

export function getTaskId(index: number): string {
  return `task-${index}`;
}

export type MissionProgressStats = {
  progressPercent: number;
  completedTasks: number;
  remainingTasks: number;
  totalTasks: number;
  completedHours: number;
  remainingHours: number;
  isFullyComplete: boolean;
};

export function createEmptyProgress(): MissionProgress {
  return { completedTaskIds: [] };
}

export function normalizeProgress(progress?: MissionProgress): MissionProgress {
  if (!progress || !Array.isArray(progress.completedTaskIds)) {
    return createEmptyProgress();
  }

  return {
    completedTaskIds: [...new Set(progress.completedTaskIds)],
  };
}

export function computeMissionProgress(
  plan: GeneratedPlan,
  progress: MissionProgress
): MissionProgressStats {
  const completedIds = new Set(progress.completedTaskIds);
  const totalTasks = plan.timeline.length;

  let completedTasks = 0;
  let completedHours = 0;
  let remainingHours = 0;

  plan.timeline.forEach((task, index) => {
    if (completedIds.has(getTaskId(index))) {
      completedTasks += 1;
      completedHours += task.hours;
    } else {
      remainingHours += task.hours;
    }
  });

  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return {
    progressPercent,
    completedTasks,
    remainingTasks: totalTasks - completedTasks,
    totalTasks,
    completedHours: Math.round(completedHours * 10) / 10,
    remainingHours: Math.round(remainingHours * 10) / 10,
    isFullyComplete: totalTasks > 0 && completedTasks === totalTasks,
  };
}

export type TodaysFocus = {
  task: string;
  hours: number;
  day: string;
  reason: string;
};

export function getTodaysFocus(
  plan: GeneratedPlan,
  progress: MissionProgress,
  mission: MissionInput
): TodaysFocus | null {
  const incompleteIndex = plan.timeline.findIndex(
    (_, index) => !progress.completedTaskIds.includes(getTaskId(index))
  );

  if (incompleteIndex === -1) {
    return null;
  }

  const task = plan.timeline[incompleteIndex];

  return {
    task: task.task,
    hours: task.hours,
    day: task.day,
    reason: `This is the next critical step for "${mission.missionName}" and should be completed today to stay on track for the ${mission.deadline} deadline.`,
  };
}

export type DeadlineWarning = {
  type: "increase_daily" | "extend_deadline";
  title: string;
  message: string;
};

export function computeDeadlineWarning(
  mission: MissionInput,
  plan: GeneratedPlan,
  progress: MissionProgress
): DeadlineWarning | null {
  const stats = computeMissionProgress(plan, progress);

  if (stats.remainingTasks === 0) {
    return null;
  }

  const remainingDays = getAvailableDays(mission.deadline);
  const capacityHours = remainingDays * mission.hoursPerDay;

  if (stats.remainingHours <= capacityHours) {
    return null;
  }

  const requiredDailyHours = stats.remainingHours / Math.max(1, remainingDays);

  if (requiredDailyHours > mission.hoursPerDay) {
    const extraDays = Math.ceil(
      (stats.remainingHours - capacityHours) / Math.max(1, mission.hoursPerDay)
    );

    if (extraDays > 0 && requiredDailyHours / mission.hoursPerDay > 1.15) {
      return {
        type: "extend_deadline",
        title: "Extend deadline",
        message: `Extend deadline by ${extraDays} day${extraDays === 1 ? "" : "s"} to complete remaining work comfortably.`,
      };
    }

    return {
      type: "increase_daily",
      title: "Increase daily workload",
      message: `Increase daily workload to ${Math.ceil(requiredDailyHours)}h/day to finish on time.`,
    };
  }

  return null;
}
