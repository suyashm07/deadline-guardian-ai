"use client";

import { motion } from "framer-motion";
import type { GeneratedPlan } from "./generated-plan";
import { GlassPanel } from "./ui/GlassPanel";

const axes = [
  { label: "Scope", value: 0.72 },
  { label: "Time pressure", value: 0.58 },
  { label: "Complexity", value: 0.65 },
  { label: "Dependencies", value: 0.41 },
  { label: "Buffer", value: 0.78 },
];

const CX = 120;
const CY = 120;
const MAX_R = 80;
const LEVELS = 4;

function polar(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

function polygonPoints(values: number[]) {
  const step = 360 / values.length;
  return values
    .map((v, i) => {
      const p = polar(i * step, MAX_R * v);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

type RiskRadarProps = {
  plan: GeneratedPlan | null;
};

function riskScoreFromLevel(riskLevel: string) {
  const normalized = riskLevel.toLowerCase();

  if (normalized.includes("high")) {
    return 78;
  }

  if (normalized.includes("low")) {
    return 32;
  }

  return 58;
}

export function RiskRadar({ plan }: RiskRadarProps) {
  const riskLevel = plan?.riskLevel ?? "Moderate";
  const overallRisk = plan
    ? riskScoreFromLevel(plan.riskLevel)
    : Math.round((axes.reduce((s, v) => s + v.value, 0) / axes.length) * 100);
  const riskAxes = plan
    ? axes.map((axis, index) => ({
        ...axis,
        value: Math.min(
          0.95,
          Math.max(0.18, overallRisk / 100 + (index - 2) * 0.06)
        ),
      }))
    : axes;
  const step = 360 / riskAxes.length;
  const dataPoints = riskAxes.map((a) => a.value);
  const riskColor =
    overallRisk >= 70 ? "text-rose" : overallRisk >= 50 ? "text-amber" : "text-emerald";

  return (
    <GlassPanel className="relative flex h-full flex-col overflow-hidden" padding="lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Risk radar
          </p>
          <h3 className="mt-1 text-[15px] font-semibold">Deadline exposure</h3>
        </div>
        <div className="text-right">
          <p className={`font-mono text-2xl font-semibold tabular-nums ${riskColor}`}>
            {overallRisk}
          </p>
          <p className="text-[10px] text-muted">{riskLevel} risk</p>
        </div>
      </div>

      <div className="relative mx-auto mt-2 flex flex-1 items-center justify-center">
        <svg viewBox="0 0 240 240" className="h-full w-full max-h-[220px]" aria-label="Deadline risk radar chart" role="img">
          {/* Grid rings */}
          {Array.from({ length: LEVELS }, (_, i) => {
            const r = ((i + 1) / LEVELS) * MAX_R;
            const pts = riskAxes
              .map((_, j) => {
                const p = polar(j * step, r);
                return `${p.x},${p.y}`;
              })
              .join(" ");
            return (
              <polygon
                key={r}
                points={pts}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis lines */}
          {riskAxes.map((_, i) => {
            const p = polar(i * step, MAX_R);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <motion.polygon
            points={polygonPoints(dataPoints)}
            fill="rgba(251, 113, 133, 0.12)"
            stroke="rgba(251, 113, 133, 0.6)"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          />

          {/* Data points */}
          {riskAxes.map((axis, i) => {
            const p = polar(i * step, MAX_R * axis.value);
            return (
              <motion.circle
                key={axis.label}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#fb7185"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                style={{ filter: "drop-shadow(0 0 6px rgba(251,113,133,0.6))" }}
              />
            );
          })}

          {/* Sweep line */}
          <motion.line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - MAX_R}
            stroke="rgba(94, 234, 212, 0.3)"
            strokeWidth="1"
            style={{ transformOrigin: `${CX}px ${CY}px` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Labels */}
          {riskAxes.map((axis, i) => {
            const p = polar(i * step, MAX_R + 22);
            return (
              <text
                key={axis.label}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="8"
                fontFamily="var(--font-geist-sans), sans-serif"
              >
                {axis.label}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 space-y-1.5">
        {riskAxes
          .filter((a) => a.value >= 0.6)
          .map((axis) => (
            <div
              key={axis.label}
              className="flex items-center justify-between rounded-lg bg-rose-dim/50 px-3 py-1.5"
            >
              <span className="text-[11px] text-rose/90">{axis.label}</span>
              <span className="font-mono text-[11px] text-rose">
                {Math.round(axis.value * 100)}%
              </span>
            </div>
          ))}
      </div>
    </GlassPanel>
  );
}
