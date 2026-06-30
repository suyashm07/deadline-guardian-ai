"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { GeneratedPlan, MissionInput } from "./generated-plan";
import { Spinner } from "./ui/Toast";
import { useToast } from "./ui/Toast";
import { GlassPanel } from "./ui/GlassPanel";

type GeneratePlanResponse =
  | {
      success: true;
      plan: GeneratedPlan;
    }
  | {
      success: false;
      message: string;
    };

type MissionComposerProps = {
  onPlanGenerated: (plan: GeneratedPlan, mission: MissionInput) => void;
};

const GENERATION_MESSAGES = [
  "🧠 Understanding mission...",
  "📅 Building timeline...",
  "⚠ Calculating risks...",
  "📈 Optimizing workload...",
  "✨ Finalizing strategy...",
];

export function MissionComposer({ onPlanGenerated }: MissionComposerProps) {
  const { showToast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [missionName, setMissionName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const interval = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % GENERATION_MESSAGES.length);
    }, 2200);

    return () => {
      window.clearInterval(interval);
    };
  }, [isGenerating]);

  const handleError = useCallback(() => {
    showToast({
      title: "Generation Failed",
      message: "Unable to generate your mission plan. Please try again.",
      variant: "error",
    });
  }, [showToast]);

  return (
    <GlassPanel padding="lg" className="premium-card relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(90deg, rgba(94,234,212,0.04) 0%, transparent 50%, rgba(167,139,250,0.04) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold">Mission composer</h3>
              <p className="text-[11px] text-muted">
                Define a deadline — AI builds the execution plan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            disabled={isGenerating}
            className="btn-ghost rounded-lg px-3 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>

        <form
          className={`mt-5 space-y-4 ${isGenerating ? "cursor-wait" : ""}`}
          onSubmit={async (e) => {
            e.preventDefault();

            if (isGenerating) {
              return;
            }

            const mission: MissionInput = {
              missionName,
              deadline,
              description,
              priority,
              hoursPerDay,
            };

            setIsGenerating(true);

            try {
              const response = await fetch("/api/generate-plan", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(mission),
              });

              const data = (await response.json()) as GeneratePlanResponse;

              if (!response.ok || !data.success) {
                throw new Error(
                  data.success ? "Failed to generate plan." : data.message
                );
              }

              onPlanGenerated(data.plan, mission);
            } catch {
              handleError();
            } finally {
              setIsGenerating(false);
              setMessageIndex(0);
            }
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              placeholder="Mission name — e.g. Climate policy research paper"
              disabled={isGenerating}
              className="input-os flex-1 rounded-xl px-4 py-3 text-sm placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={isGenerating}
              className="input-os rounded-xl px-4 py-3 text-sm [color-scheme:dark] disabled:cursor-not-allowed disabled:opacity-60 sm:w-44"
            />
          </div>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Scope, constraints, available hours per day..."
                disabled={isGenerating}
                className="input-os w-full resize-none rounded-xl px-4 py-3 text-sm placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
              />
              <div>
                <label className="mb-2 block text-sm text-muted">
                  Hours Available Per Day
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  disabled={isGenerating}
                  className="input-os w-full rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-muted">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={isGenerating}
                  className="input-os w-full rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-muted">
              {isGenerating
                ? GENERATION_MESSAGES[messageIndex]
                : "AI will generate timeline, risk analysis, and hour allocation"}
            </p>
            <motion.button
              type="submit"
              disabled={isGenerating}
              whileTap={isGenerating ? undefined : { scale: 0.98 }}
              whileHover={isGenerating ? undefined : { scale: 1.02 }}
              className="btn-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm disabled:cursor-wait disabled:opacity-70"
            >
              {isGenerating ? <Spinner /> : null}
              {isGenerating
                ? GENERATION_MESSAGES[messageIndex]
                : "Generate mission plan"}
            </motion.button>
          </div>
        </form>
      </div>
    </GlassPanel>
  );
}
