"use client";

import { EmptyPlaceholder } from "./EmptyPlaceholder";

export function NoMissionsFound() {
  return (
    <EmptyPlaceholder
      title="No matching missions found."
      description="Try a different search term or generate a new mission plan."
      icon={
        <svg
          className="h-6 w-6 text-muted"
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
