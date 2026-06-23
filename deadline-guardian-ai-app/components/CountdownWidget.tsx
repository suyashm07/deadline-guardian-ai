"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { GlassPanel } from "./ui/GlassPanel";

const DEADLINE = new Date("2026-06-28T23:59:59");
const START = new Date("2026-06-19T00:00:00");

type TimeUnit = { value: number; label: string };

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function computeRemaining(now: Date) {
  const diff = Math.max(0, DEADLINE.getTime() - now.getTime());
  const total = Math.max(1, DEADLINE.getTime() - START.getTime());
  const elapsed = total - diff;
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, pct, diff };
}

function UnitBlock({ unit, index }: { unit: TimeUnit; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface px-3 py-2.5 sm:px-4 sm:py-3 min-w-[56px] sm:min-w-[64px]">
        <motion.span
          key={unit.value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="block text-center font-mono text-2xl font-medium tabular-nums sm:text-3xl"
        >
          {pad(unit.value)}
        </motion.span>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden="true"
        />
      </div>
      <span className="mt-1.5 text-[10px] uppercase tracking-widest text-muted">
        {unit.label}
      </span>
    </motion.div>
  );
}

export function CountdownWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds, pct, diff } = useMemo(
    () => computeRemaining(now),
    [now]
  );

  const urgency =
    pct > 75 ? "critical" : pct > 50 ? "elevated" : "nominal";

  const urgencyColor = {
    nominal: "text-accent",
    elevated: "text-amber",
    critical: "text-rose",
  }[urgency];

  const ringColor = {
    nominal: "rgba(94, 234, 212, 0.8)",
    elevated: "rgba(251, 191, 36, 0.8)",
    critical: "rgba(251, 113, 133, 0.8)",
  }[urgency];

  const units: TimeUnit[] = [
    { value: days, label: "Days" },
    { value: hours, label: "Hrs" },
    { value: minutes, label: "Min" },
    { value: seconds, label: "Sec" },
  ];

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <GlassPanel className="relative overflow-hidden" padding="lg">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            urgency === "critical"
              ? "radial-gradient(circle, rgba(251,113,133,0.25), transparent 70%)"
              : urgency === "elevated"
                ? "radial-gradient(circle, rgba(251,191,36,0.2), transparent 70%)"
                : "radial-gradient(circle, rgba(94,234,212,0.2), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-widest ${urgencyColor}`}>
              {urgency === "critical"
                ? "Critical window"
                : urgency === "elevated"
                  ? "Elevated urgency"
                  : "Time remaining"}
            </span>
            <span className="h-1 w-1 rounded-full bg-muted" />
            <span className="text-[10px] text-muted">
              {Math.round(pct)}% elapsed
            </span>
          </div>

          <h2 className="mt-2 text-lg font-semibold tracking-tight sm:text-xl">
            Research paper deadline
          </h2>
          <p className="mt-1 text-xs text-muted">
            {diff > 0
              ? "AI recommends maintaining current pace with 18h buffer"
              : "Deadline reached — review contingency plan"}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
            {units.map((unit, i) => (
              <UnitBlock key={unit.label} unit={unit} index={i} />
            ))}
          </div>
        </div>

        {/* Urgency ring */}
        <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center sm:h-40 sm:w-40">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="4"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={ringColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              style={{ filter: `drop-shadow(0 0 8px ${ringColor})` }}
            />
          </svg>
          <div className="text-center">
            <p className={`font-mono text-3xl font-semibold tabular-nums ${urgencyColor}`}>
              {days}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted">
              days left
            </p>
          </div>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${ringColor.replace("0.8", "0.06")}, transparent)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          />
        </div>
      </div>
    </GlassPanel>
  );
}
