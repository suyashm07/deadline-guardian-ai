"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useMission } from "@/components/MissionContext";
import { getRiskIndicatorColor } from "@/lib/mission-stats";

const navItems = [
  {
    id: "command",
    href: "/",
    label: "Command",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    id: "missions",
    href: "/missions",
    label: "Missions",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
  {
    id: "timeline",
    href: "/timeline",
    label: "Timeline",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    id: "analytics",
    href: "/analytics",
    label: "Analytics",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function formatRecentDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function Sidebar() {
  const pathname = usePathname();
  const { recentMissions, activeMissionId, loadMission } = useMission();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border bg-glass/40 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-accent-dim">
          <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(94,234,212,0.6)]" />
          <div className="absolute inset-0 animate-pulse-ring rounded-lg ring-1 ring-accent/30" />
        </div>
        <div>
          <p className="text-[13px] font-semibold tracking-tight">Guardian</p>
          <p className="text-[10px] text-muted">Command OS</p>
        </div>
      </div>

      <nav className="space-y-0.5 px-3">
        {navItems.map((item) => {
          const active = isActiveRoute(pathname, item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
                active
                  ? "bg-surface-hover text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              <span className={active ? "text-accent" : ""}>{item.icon}</span>
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {recentMissions.length > 0 ? (
        <div className="mt-4 px-3">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-widest text-muted">
            Recent Missions
          </p>
          <div className="space-y-1">
            {recentMissions.map((entry) => {
              const isActive = entry.id === activeMissionId;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => loadMission(entry)}
                  className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-all duration-200 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 ${
                    isActive ? "bg-surface-hover" : ""
                  }`}
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${getRiskIndicatorColor(
                      entry.plan.riskLevel
                    )}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-medium">
                      {entry.mission.missionName}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted">
                      {formatRecentDate(entry.createdAt)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="flex-1" />

      <div className="relative border-t border-border p-4" ref={profileRef}>
        {profileOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 overflow-hidden rounded-xl border border-border bg-glass/95 shadow-lg backdrop-blur-xl">
            <div className="border-b border-border px-3 py-2.5">
              <p className="text-xs font-medium">Operator</p>
              <p className="text-[10px] text-muted">Pro workspace</p>
            </div>
            <button
              type="button"
              onClick={() => setProfileOpen(false)}
              className="flex w-full px-3 py-2.5 text-left text-[13px] text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setProfileOpen(false)}
              className="flex w-full px-3 py-2.5 text-left text-[13px] text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              About Project
            </button>
            <button
              type="button"
              onClick={() => setProfileOpen(false)}
              className="flex w-full px-3 py-2.5 text-left text-[13px] text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              Logout
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setProfileOpen((open) => !open)}
          className="glass-panel-subtle premium-card w-full rounded-xl p-3 text-left transition-all duration-200 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          aria-expanded={profileOpen}
          aria-haspopup="menu"
        >
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-accent/30 to-violet/30 shadow-[0_0_16px_rgba(94,234,212,0.15)]" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium">Operator</p>
              <p className="text-[10px] text-muted">Pro workspace</p>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
