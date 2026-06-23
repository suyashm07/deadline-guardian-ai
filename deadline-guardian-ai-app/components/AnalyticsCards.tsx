"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "./ui/GlassPanel";

const metrics = [
  {
    id: "velocity",
    label: "Plan velocity",
    value: 87,
    unit: "%",
    trend: "+4.2%",
    trendUp: true,
    sparkline: [40, 55, 48, 62, 58, 72, 87],
    color: "accent",
  },
  {
    id: "focus",
    label: "Focus score",
    value: 92,
    unit: "",
    trend: "Peak 9–12",
    trendUp: true,
    sparkline: [70, 78, 85, 88, 90, 91, 92],
    color: "violet",
  },
  {
    id: "completion",
    label: "Phase completion",
    value: 50,
    unit: "%",
    trend: "2 of 4",
    trendUp: true,
    sparkline: [0, 25, 25, 50, 50, 50, 50],
    color: "emerald",
  },
  {
    id: "streak",
    label: "On-time streak",
    value: 12,
    unit: "d",
    trend: "Personal best",
    trendUp: true,
    sparkline: [4, 5, 7, 8, 9, 11, 12],
    color: "amber",
  },
];

const colorMap = {
  accent: { text: "text-accent", fill: "#5eead4", bg: "bg-accent-dim" },
  violet: { text: "text-violet", fill: "#a78bfa", bg: "bg-violet-dim" },
  emerald: { text: "text-emerald", fill: "#34d399", bg: "bg-emerald-dim" },
  amber: { text: "text-amber", fill: "#fbbf24", bg: "bg-amber-dim" },
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="opacity-80" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1] - min) / range) * (h - 4) - 2}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

export function AnalyticsCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, i) => {
        const colors = colorMap[metric.color as keyof typeof colorMap];
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <GlassPanel subtle padding="sm" className="h-full">
              <div className="flex items-start justify-between">
                <p className="text-[11px] text-muted">{metric.label}</p>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-medium ${colors.bg} ${colors.text}`}
                >
                  {metric.trend}
                </span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <p className={`font-mono text-2xl font-semibold tabular-nums ${colors.text}`}>
                  {metric.value}
                  {metric.unit && (
                    <span className="text-base text-muted">{metric.unit}</span>
                  )}
                </p>
                <Sparkline data={metric.sparkline} color={colors.fill} />
              </div>
            </GlassPanel>
          </motion.div>
        );
      })}
    </div>
  );
}
