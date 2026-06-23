"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { GlassPanel } from "./ui/GlassPanel";

const recommendation = {
  task: "Write body sections — complete arguments with citations and examples",
  taskMeta: "4h estimated · Critical path",
  riskLevel: "Moderate" as const,
  riskScore: 62,
  expectedCompletion: "Jun 27, 2026",
  bufferRemaining: "18h",
  successProbability: 87,
};

const riskStyles = {
  Low: { text: "text-emerald", bg: "bg-emerald-dim", dot: "bg-emerald" },
  Moderate: { text: "text-amber", bg: "bg-amber-dim", dot: "bg-amber" },
  High: { text: "text-rose", bg: "bg-rose-dim", dot: "bg-rose" },
};

function MetricCell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function GuardianRecommendations() {
  const risk = riskStyles[recommendation.riskLevel];
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset =
    circumference - (recommendation.successProbability / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <GlassPanel padding="lg" className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="inline-flex items-center gap-1.5 rounded-md bg-violet-dim px-2 py-0.5 text-[10px] font-medium text-violet"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
                AI Guardian
              </motion.span>
              <h3 className="mt-2 text-[15px] font-semibold">
                AI Guardian Recommendations
              </h3>
            </div>

            {/* Success probability ring */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <svg
                  className="absolute inset-0 -rotate-90"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    }}
                    style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.4))" }}
                  />
                </svg>
                <span className="font-mono text-xs font-semibold tabular-nums text-emerald">
                  {recommendation.successProbability}%
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                  Success probability
                </p>
                <p className="text-xs text-emerald">On track to finish</p>
              </div>
            </div>
          </div>

          {/* Recommended task */}
          <div className="mt-5 rounded-xl border border-accent/20 bg-accent-dim/30 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-accent/80">
              Recommended for today
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/90">
              {recommendation.task}
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-muted">
              {recommendation.taskMeta}
            </p>
          </div>

          {/* Metrics grid */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCell label="Risk level">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${risk.dot}`} />
                <span className={`text-sm font-medium ${risk.text}`}>
                  {recommendation.riskLevel}
                </span>
                <span
                  className={`ml-auto rounded-md px-1.5 py-0.5 font-mono text-[10px] ${risk.bg} ${risk.text}`}
                >
                  {recommendation.riskScore}
                </span>
              </div>
            </MetricCell>

            <MetricCell label="Expected completion">
              <p className="font-mono text-sm font-medium tabular-nums">
                {recommendation.expectedCompletion}
              </p>
              <p className="mt-0.5 text-[10px] text-muted">1 day ahead of deadline</p>
            </MetricCell>

            <MetricCell label="Buffer remaining">
              <p className="font-mono text-sm font-medium tabular-nums text-accent">
                {recommendation.bufferRemaining}
              </p>
              <p className="mt-0.5 text-[10px] text-muted">Contingency reserve intact</p>
            </MetricCell>

            <MetricCell label="Success probability">
              <p className="font-mono text-sm font-medium tabular-nums text-emerald">
                {recommendation.successProbability}%
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${recommendation.successProbability}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }}
                  className="h-full rounded-full bg-emerald"
                  style={{ boxShadow: "0 0 8px rgba(52,211,153,0.4)" }}
                />
              </div>
            </MetricCell>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
