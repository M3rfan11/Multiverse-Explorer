"use client";

import cn from "classnames";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis";

/** Windowed pages: 1 … (current-1) current (current+1) … last */
function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  for (const [index, page] of sorted.entries()) {
    const prev = sorted[index - 1];
    if (prev !== undefined && page - prev > 1) items.push("ellipsis");
    items.push(page);
  }
  return items;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-1"
    >
      <Button
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </Button>

      {getPageItems(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden
            className="px-2 text-slate-600"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500",
              item === page
                ? "font-semibold text-space-950"
                : "text-slate-300 hover:bg-white/5",
            )}
          >
            {item === page ? (
              <motion.span
                layoutId="page-pill"
                className="absolute inset-0 rounded-lg bg-portal-500"
                transition={{ duration: DURATION.standard, ease: EASE }}
              />
            ) : null}
            <span className="relative">{item}</span>
          </button>
        ),
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </Button>
    </nav>
  );
}
