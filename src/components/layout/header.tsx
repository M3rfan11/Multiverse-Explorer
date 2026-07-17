"use client";

import cn from "classnames";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

/**
 * Sticky header: transparent over the hero, gains blur + border once
 * the page scrolls. A single boolean flips CSS classes — cheaper than
 * animating styles per scroll frame.
 */
export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-space-950 py-3"
          : "border-transparent bg-transparent py-5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center px-4 md:px-8 lg:px-12">
        <Link
          href="/"
          className="rounded-md font-logo text-lg tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
        >
          {/* Quieter than the hero wordmark — one loud logo per screen */}
          Multiverse Explorer
        </Link>
        <nav className="ml-auto flex items-center gap-5 text-sm">
          <Link
            href="/insights"
            className="relative rounded-md text-slate-300 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-portal-400 after:to-rick-blue after:transition-transform after:duration-300 hover:text-portal-300 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-portal-500"
          >
            Insights
          </Link>
        </nav>
      </div>
    </header>
  );
}
