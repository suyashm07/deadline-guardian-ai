"use client";

import { motion } from "framer-motion";
import type { GeneratedPlan } from "./generated-plan";
import { GlassPanel } from "./ui/GlassPanel";

const phases = [
  {
    id: "research",
    label: "Research",
    days: "Jun 19",
    hours: 2,
    status: "complete" as const,
    ai: "Sources indexed · 12 papers",
    width: 18,
  },
  {
    id: "intro",
    label: "Introduction",
    days: "Jun 20",
    hours: 1.5,
    status: "complete" as const,
    ai: "Thesis validated by AI",
    width: 14,
  },
  {
    id: "body",
    label: "Body sections",
    days: "Jun 21–22",
    hours: 4,
    status: "active" as const,
    ai: "AI drafting assist active",
    width: 36,
  },
  {
    id: "review",
    label: "Review",
    days: "Jun 23",
    hours: 1.5,
    status: "upcoming" as const,
    ai: "Proofread queue ready",
    width: 14,
  },
  {
    id: "buffer",
    label: "Buffer",
    days: "Jun 24–28",
    hours: 18,
    status: "buffer" as const,
    ai: "Contingency reserve",
    width: 18,
  },
];

const statusStyles = {
  complete: { bar: "bg-emerald/80", dot: "bg-emerald", glow: "rgba(52,211,153,0.4)" },
  active: { bar: "bg-accent", dot: "bg-accent", glow: "rgba(94,234,212,0.5)" },
  upcoming: { bar: "bg-white/20", dot: "bg-white/30", glow: "transparent" },
  buffer: { bar: "bg-violet/60", dot: "bg-violet", glow: "rgba(167,139,250,0.3)" },
};

type AITimelineProps = {
  plan: GeneratedPlan | null;
};

export function AITimeline({ plan }: AITimelineProps) {
  const totalHours =
    plan?.timeline.reduce((sum, phase) => sum + phase.hours, 0) ?? 0;
  const timelinePhases = plan
    ? plan.timeline.map((phase, index) => ({
        id: `${phase.day}-${index}`,
        label: phase.task,
        days: phase.day,
        hours: phase.hours,
        status: index === 0 ? ("active" as const) : ("upcoming" as const),
        ai: phase.task,
        width: Math.max(8, (phase.hours / Math.max(totalHours, 1)) * 100),
      }))
    : phases;
  const recommendation =
    plan?.recommendations[0] ??
    "Body sections are the critical path. Start 30 min earlier tomorrow to preserve buffer. Current trajectory:";

  return (
    <GlassPanel padding="lg" className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="inline-flex items-center gap-1.5 rounded-md bg-violet-dim px-2 py-0.5 text-[10px] font-medium text-violet"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
              AI Timeline
            </motion.span>
            <span className="text-[10px] text-muted">Auto-generated · {timelinePhases.length} phases</span>
          </div>
          <h3 className="mt-2 text-[15px] font-semibold">Mission execution path</h3>
        </div>
        <div className="flex gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Done
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Buffer
          </span>
        </div>
      </div>

      {/* Gantt-style bar */}
      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/[0.04]">
        {timelinePhases.map((phase, i) => {
          const style = statusStyles[phase.status];
          return (
            <motion.div
              key={phase.id}
              initial={{ width: 0 }}
              animate={{ width: `${phase.width}%` }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className={`relative h-full ${style.bar} ${i > 0 ? "border-l border-background/40" : ""}`}
              style={
                phase.status === "active"
                  ? { boxShadow: `0 0 12px ${style.glow}` }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* Phase cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {timelinePhases.map((phase, i) => {
          const style = statusStyles[phase.status];
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
              className={`relative rounded-xl border p-3.5 transition-colors ${
                phase.status === "active"
                  ? "border-accent/30 bg-accent-dim/30"
                  : "border-border bg-surface"
              }`}
            >
              {phase.status === "active" && (
                <motion.div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${style.dot}`}
                  style={
                    phase.status === "active"
                      ? { boxShadow: `0 0 8px ${style.glow}` }
                      : undefined
                  }
                />
                <span className="text-xs font-medium">{phase.label}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted">{phase.days}</p>
              <p className="mt-2 font-mono text-sm tabular-nums">{phase.hours}h</p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                {phase.ai}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* AI insight strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-5 flex items-start gap-3 rounded-xl border border-violet/20 bg-violet-dim/40 px-4 py-3"
      >
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-violet" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <div>
          <p className="text-xs font-medium text-violet/90">AI Recommendation</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
            {recommendation}{" "}
            <span className="text-emerald">on track</span>.
          </p>
        </div>
      </motion.div>
    </GlassPanel>
  );
}
