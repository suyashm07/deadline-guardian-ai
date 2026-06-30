import type { GeneratedPlan, MissionInput } from "@/components/generated-plan";

function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getAvailableDays(deadline: string): number {
  const today = startOfToday();
  const end = parseDateOnly(deadline);
  end.setHours(0, 0, 0, 0);
  const diffMs = end.getTime() - today.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(1, days);
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function deriveRiskAndConfidence(
  estimatedHours: number,
  availableDays: number,
  hoursPerDay: number
): { riskLevel: string; confidence: number } {
  const maxCapacity = availableDays * hoursPerDay;
  const utilization = maxCapacity > 0 ? estimatedHours / maxCapacity : 1;
  const dailyAverage = availableDays > 0 ? estimatedHours / availableDays : estimatedHours;
  const dailyPressure = dailyAverage / hoursPerDay;

  if (availableDays >= 7 && utilization <= 0.65 && dailyPressure <= 0.75) {
    return {
      riskLevel: "Low",
      confidence: Math.min(95, Math.round(72 + (1 - utilization) * 23)),
    };
  }

  if (availableDays <= 2 || utilization > 0.95 || dailyPressure > 0.95) {
    return {
      riskLevel: "High",
      confidence: Math.max(20, Math.round(38 - utilization * 15)),
    };
  }

  return {
    riskLevel: "Medium",
    confidence: Math.min(88, Math.round(52 + (1 - utilization) * 28)),
  };
}

export function clampPlanToDeadline(
  plan: GeneratedPlan,
  deadline: string,
  hoursPerDay: number
): GeneratedPlan {
  const availableDays = getAvailableDays(deadline);
  const today = startOfToday();
  const deadlineDate = parseDateOnly(deadline);
  const cappedHoursPerDay = Math.max(1, hoursPerDay);

  const timeline = plan.timeline.slice(0, availableDays).map((item, index, items) => {
    const isLast = index === items.length - 1;
    const dayDate = isLast ? deadlineDate : addDays(today, index);

    return {
      day: formatDayLabel(dayDate > deadlineDate ? deadlineDate : dayDate),
      task: item.task,
      hours: Math.min(
        cappedHoursPerDay,
        Math.max(0.5, Math.round(item.hours * 10) / 10)
      ),
    };
  });

  if (timeline.length === 0) {
    timeline.push({
      day: formatDayLabel(deadlineDate),
      task: "Complete mission deliverables",
      hours: Math.min(cappedHoursPerDay, 2),
    });
  } else {
    timeline[timeline.length - 1] = {
      ...timeline[timeline.length - 1],
      day: formatDayLabel(deadlineDate),
    };
  }

  const estimatedHours = Math.max(
    1,
    Math.round(timeline.reduce((sum, item) => sum + item.hours, 0) * 10) / 10
  );
  const { riskLevel, confidence } = deriveRiskAndConfidence(
    estimatedHours,
    availableDays,
    cappedHoursPerDay
  );

  return {
    ...plan,
    timeline,
    estimatedHours,
    riskLevel,
    confidence: Math.min(100, Math.max(0, confidence)),
  };
}

export function parseModelJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1].trim() : trimmed;

  return JSON.parse(jsonText);
}

export function buildPlanningPrompt(body: MissionInput): string {
  const today = new Date().toISOString().slice(0, 10);
  const availableDays = getAvailableDays(body.deadline);

  return `
You are Deadline Guardian AI, a mission-specific planning system.

Create a practical execution plan for this exact user mission. The plan must be tailored to the mission name and description, not a generic productivity template.

Mission name: ${body.missionName}
Mission description: ${body.description || "No extra description provided."}
Deadline date: ${body.deadline}
Priority: ${body.priority}
Available focused hours per day: ${body.hoursPerDay}
Current date: ${today}
Available planning days (inclusive): ${availableDays}

Planning rules:
- Generate EXACTLY ${availableDays} timeline items — one per calendar day from ${today} through ${body.deadline}.
- The timeline MUST NOT extend beyond ${body.deadline}. The final task must occur on ${body.deadline}.
- Generate realistic daily tasks using the available hours per day as a hard planning constraint.
- Each timeline item must be a concrete action the user can perform that day.
- Use mission-specific nouns and deliverables in every task.
- Do not use vague phase names such as "Research", "Drafting", "Review", "Planning", "Execution", or "Finalization" unless that exact activity genuinely fits the mission.
- If a task involves learning, specify what topic, skill, chapter, module, workout, prototype, customer segment, dataset, model, feature, or artifact is being worked on.
- Allocate hours intelligently: harder or higher-priority work can take more hours, lighter checkpoints can take fewer hours, and no day should exceed the available focused hours per day.
- estimatedHours must equal the sum of all timeline item hours.
- confidence must reflect how likely the user is to finish on time, from 0 to 100.
- riskLevel must be exactly one of: Low, Medium, High.

Risk rules:
- Low: deadline has enough time, daily workload is comfortably below the user's available hours, and dependencies are limited.
- Medium: workload is achievable but requires consistency, scope control, or skill-building.
- High: deadline is tight, the mission is broad, daily workload is near the limit, or the description implies hard dependencies.

Recommendation rules:
- recommendations must be practical, mission-specific actions.
- Avoid generic advice like "stay consistent", "manage your time", or "track progress" unless tied to a specific mission artifact or measurable checkpoint.
- Include 3 to 6 recommendations.

Return strict JSON only. Do not include markdown, prose, code fences, comments, or extra keys.
The JSON must match this exact TypeScript shape:
{
  "summary": "string",
  "riskLevel": "Low | Medium | High",
  "estimatedHours": 0,
  "confidence": 0,
  "timeline": [
    {
      "day": "string",
      "task": "string",
      "hours": 0
    }
  ],
  "recommendations": ["string"]
}
`;
}
