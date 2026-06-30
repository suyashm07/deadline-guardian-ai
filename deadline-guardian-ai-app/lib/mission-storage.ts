import type { MissionHistoryEntry } from "@/components/generated-plan";
import { createEmptyProgress, normalizeProgress } from "@/lib/mission-progress";

const STORAGE_KEY = "deadline-guardian-mission-history";

function normalizeEntry(entry: MissionHistoryEntry): MissionHistoryEntry {
  return {
    ...entry,
    progress: normalizeProgress(entry.progress ?? createEmptyProgress()),
  };
}

export function loadMissionHistory(): MissionHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as MissionHistoryEntry[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeEntry)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch {
    return [];
  }
}

export function persistMissionHistory(entries: MissionHistoryEntry[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries.map(normalizeEntry))
  );
}

export function createMissionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `mission-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
