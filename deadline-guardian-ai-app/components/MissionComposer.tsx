"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { GlassPanel } from "./ui/GlassPanel";

export function MissionComposer() {
  const [expanded, setExpanded] = useState(false);

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

        <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Mission name — e.g. Climate policy research paper"
              className="input-os flex-1 rounded-xl px-4 py-3 text-sm placeholder:text-muted"
            />
            <input
              type="date"
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
                placeholder="Scope, constraints, available hours per day..."
                className="input-os w-full resize-none rounded-xl px-4 py-3 text-sm placeholder:text-muted"
              />
              <div className="flex flex-wrap gap-2">
                {["High priority", "Team project", "Exam prep", "Client deliverable"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-muted transition-colors hover:border-border-strong hover:text-foreground"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-muted">
              AI will generate timeline, risk analysis, and hour allocation
            </p>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
              Generate mission plan
            </motion.button>
          </div>
        </form>
      </div>
    </GlassPanel>
  );
}
