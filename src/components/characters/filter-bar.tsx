"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  SPECIES_OPTIONS,
  type DashboardFilters,
} from "@/lib/hooks/use-dashboard-filters";
import { DURATION } from "@/lib/motion";
import type { CharacterStatus } from "@/types/api";

const DEBOUNCE_MS = 400;

const STATUS_OPTIONS = [
  { value: "", label: "Any status" },
  { value: "alive", label: "Alive" },
  { value: "dead", label: "Dead" },
  { value: "unknown", label: "Unknown" },
];

const STATUS_FROM_VALUE: Partial<Record<string, CharacterStatus>> = {
  alive: "Alive",
  dead: "Dead",
  unknown: "unknown",
};

interface FilterBarProps {
  filters: DashboardFilters;
  resultCount: number | undefined;
  onChange: (update: Partial<Omit<DashboardFilters, "page">>) => void;
  onClear: () => void;
}

export function FilterBar({
  filters,
  resultCount,
  onChange,
  onClear,
}: FilterBarProps) {
  // Local input state so typing feels instant; the URL updates after the debounce.
  const [nameInput, setNameInput] = useState(filters.name);

  // Re-sync when the URL changes from outside (back button, chips, clear).
  useEffect(() => {
    setNameInput(filters.name);
  }, [filters.name]);

  useEffect(() => {
    if (nameInput === filters.name) return;
    const timer = setTimeout(() => onChange({ name: nameInput }), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [nameInput, filters.name, onChange]);

  const chips: { key: string; label: string; remove: () => void }[] = [];
  if (filters.name) {
    chips.push({
      key: "name",
      label: `Name: ${filters.name}`,
      remove: () => onChange({ name: "" }),
    });
  }
  if (filters.status) {
    chips.push({
      key: "status",
      label: `Status: ${filters.status}`,
      remove: () => onChange({ status: undefined }),
    });
  }
  if (filters.species) {
    chips.push({
      key: "species",
      label: `Species: ${filters.species}`,
      remove: () => onChange({ species: "" }),
    });
  }

  return (
    <section aria-label="Character filters" className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.34-4.34M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
          <Input
            aria-label="Search characters by name"
            placeholder="Search characters…"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="pl-9 pr-9"
          />
          {nameInput ? (
            <button
              aria-label="Clear search"
              onClick={() => setNameInput("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
            >
              <svg
                aria-hidden
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : null}
        </div>

        <Select
          aria-label="Filter by status"
          className="sm:w-44"
          options={STATUS_OPTIONS}
          value={filters.status?.toLowerCase() ?? ""}
          onChange={(e) =>
            onChange({ status: STATUS_FROM_VALUE[e.target.value] })
          }
        />

        <Select
          aria-label="Filter by species"
          className="sm:w-52"
          options={[
            { value: "", label: "Any species" },
            ...SPECIES_OPTIONS.map((species) => ({
              value: species,
              label: species === "unknown" ? "Unknown" : species,
            })),
          ]}
          value={filters.species}
          onChange={(e) => onChange({ species: e.target.value })}
        />
      </div>

      <div className="flex min-h-7 flex-wrap items-center gap-2">
        <AnimatePresence initial={false}>
          {chips.map((chip) => (
            <motion.button
              key={chip.key}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: DURATION.micro }}
              onClick={chip.remove}
              className="inline-flex items-center gap-1.5 rounded-full border border-portal-500/30 bg-portal-500/10 px-3 py-1 text-xs text-portal-300 hover:bg-portal-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
            >
              {chip.label}
              <span aria-hidden>×</span>
            </motion.button>
          ))}
        </AnimatePresence>

        {chips.length > 1 ? (
          <button
            onClick={onClear}
            className="text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
          >
            Clear all
          </button>
        ) : null}

        <p aria-live="polite" className="ml-auto text-xs text-slate-500">
          {resultCount !== undefined
            ? `${resultCount.toLocaleString()} character${resultCount === 1 ? "" : "s"} found`
            : " "}
        </p>
      </div>
    </section>
  );
}
