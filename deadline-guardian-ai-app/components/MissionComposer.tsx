"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { GeneratedPlan, MissionInput } from "./generated-plan";
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

export function MissionComposer({ onPlanGenerated }: MissionComposerProps) {
  const [expanded, setExpanded] = useState(false);

const [missionName, setMissionName] = useState("");
const [deadline, setDeadline] = useState("");
const [description, setDescription] = useState("");
const [priority, setPriority] = useState("Medium");
const [hoursPerDay, setHoursPerDay] = useState(4);
const [isGenerating, setIsGenerating] = useState(false);
const [error, setError] = useState("");

  return (
    <GlassPanel padding="lg" className="relative overflow-hidden">
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
            className="rounded-lg border border-border px-3 py-1.5 text-[11px] text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");

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
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Failed to generate mission plan."
              );
            } finally {
              setIsGenerating(false);
            }
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
          <input
              type="text"
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              placeholder="Mission name — e.g. Climate policy research paper"
              className="input-os flex-1 rounded-xl px-4 py-3 text-sm placeholder:text-muted"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-os rounded-xl px-4 py-3 text-sm [color-scheme:dark] sm:w-44"
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
                className="input-os w-full resize-none rounded-xl px-4 py-3 text-sm placeholder:text-muted"
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
                  className="input-os w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
              <div>
              <label className="mb-2 block text-sm text-muted">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-os w-full rounded-xl px-4 py-3 text-sm"
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
              {error || "AI will generate timeline, risk analysis, and hour allocation"}
            </p>
            <motion.button
              type="submit"
              disabled={isGenerating}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
              {isGenerating ? "Generating..." : "Generate mission plan"}
            </motion.button>
          </div>
        </form>
      </div>
    </GlassPanel>
  );
}
