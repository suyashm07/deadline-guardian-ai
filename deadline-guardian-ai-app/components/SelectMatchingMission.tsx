"use client";

import { EmptyPlaceholder } from "./EmptyPlaceholder";

export function SelectMatchingMission() {
  return (
    <EmptyPlaceholder
      title="Matching missions found"
      description="Select a mission from Recent Missions in the sidebar or open one from Mission History."
      icon={
        <svg
          className="h-6 w-6 text-electric"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      }
    />
  );
}
