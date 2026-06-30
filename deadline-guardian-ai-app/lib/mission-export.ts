import type { MissionHistoryEntry } from "@/components/generated-plan";
import { computeMissionProgress } from "@/lib/mission-progress";

function buildPrintHtml(entry: MissionHistoryEntry): string {
  const stats = computeMissionProgress(entry.plan, entry.progress);

  const timelineRows = entry.plan.timeline
    .map(
      (task, index) => `
        <tr>
          <td>${task.day}</td>
          <td>${task.task}</td>
          <td>${task.hours}h</td>
          <td>${entry.progress.completedTaskIds.includes(`task-${index}`) ? "Done" : "Pending"}</td>
        </tr>`
    )
    .join("");

  const recommendations = entry.plan.recommendations
    .map((item) => `<li>${item}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${entry.mission.missionName} — Deadline Guardian</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #111; padding: 40px; }
    h1 { margin-bottom: 8px; }
    .meta { color: #555; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #f5f5f5; }
  </style>
</head>
<body>
  <h1>${entry.mission.missionName}</h1>
  <p class="meta">Due ${entry.mission.deadline} · ${entry.plan.riskLevel} risk · ${stats.progressPercent}% complete</p>
  <p>${entry.plan.summary}</p>
  <h2>Timeline</h2>
  <table>
    <thead><tr><th>Day</th><th>Task</th><th>Hours</th><th>Status</th></tr></thead>
    <tbody>${timelineRows}</tbody>
  </table>
  <h2>Recommendations</h2>
  <ul>${recommendations}</ul>
</body>
</html>`;
}

export function exportMissionJson(entry: MissionHistoryEntry) {
  const blob = new Blob([JSON.stringify(entry, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${entry.mission.missionName.replace(/\s+/g, "-").toLowerCase()}-mission.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function printMission(entry: MissionHistoryEntry) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(buildPrintHtml(entry));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

export function exportMissionPdf(entry: MissionHistoryEntry) {
  printMission(entry);
}
