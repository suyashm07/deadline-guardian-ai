export interface GeneratedPlan {
  summary: string;
  riskLevel: string;
  estimatedHours: number;
  confidence: number;
  timeline: {
    day: string;
    task: string;
    hours: number;
  }[];
  recommendations: string[];
}

export interface MissionInput {
  missionName: string;
  deadline: string;
  description: string;
  priority: string;
  hoursPerDay: number;
}

export interface MissionProgress {
  completedTaskIds: string[];
}

export interface MissionHistoryEntry {
  id: string;
  mission: MissionInput;
  plan: GeneratedPlan;
  progress: MissionProgress;
  createdAt: string;
}
