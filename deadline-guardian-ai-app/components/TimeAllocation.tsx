"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "./ui/GlassPanel";

const allocations = [
  { label: "Research", hours: 2, pct: 22, color: "#5eead4" },
  { label: "Writing", hours: 5.5, pct: 44, color: "#a78bfa" },
  { label: "Review", hours: 1.5, pct: 17, color: "#fbbf24" },
  { label: "Buffer", hours: 1.5, pct: 17, color: "#34d399" },
];

const TOTAL = allocations.reduce((s, a) => s + a.hours, 0);

function DonutChart() {
  const size = 140;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = allocations.map((seg, i) => {
    const offset = allocations
      .slice(0, i)
      .reduce((sum, s) => sum + (s.pct / 100) * circumference, 0);
    return { seg, offset };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth={stroke}
      />
      {segments.map(({ seg, offset }) => {
        const dash = (seg.pct / 100) * circumference;
        return (
          <motion.circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ filter: `drop-shadow(0 0 6px ${seg.color}40)` }}
          />
        );
      })}
    </svg>
  );
}

export function TimeAllocation() {
  return (
    <GlassPanel className="flex h-full flex-col" padding="lg">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
          Time allocation
        </p>
        <h3 className="mt-1 text-[15px] font-semibold">Hour distribution</h3>
      </div>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <DonutChart />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-semibold tabular-nums">
              {TOTAL}
            </span>
            <span className="text-[10px] text-muted">hours</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-3">
          {allocations.map((seg, i) => (
            <motion.div
              key={seg.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs">{seg.label}</span>
                </div>
                <span className="font-mono text-xs tabular-nums text-muted">
                  {seg.hours}h · {seg.pct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${seg.pct}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Daily avg", value: "1.8h" },
            { label: "Peak day", value: "4.0h" },
            { label: "Remaining", value: "4.5h" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-surface px-2.5 py-2 text-center"
            >
              <p className="font-mono text-sm font-medium tabular-nums">
                {stat.value}
              </p>
              <p className="text-[9px] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
