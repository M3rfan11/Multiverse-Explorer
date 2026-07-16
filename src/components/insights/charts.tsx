"use client";

import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { AnalyticsResponse } from "@/types/analytics";

const STATUS_COLORS: Record<string, string> = {
  Alive: "#4ADE80",
  Dead: "#F87171",
  unknown: "#64748B",
};

const TREEMAP_COLORS = [
  "#22C55E",
  "#38BDF8",
  "#15803D",
  "#0EA5E9",
  "#86EFAC",
  "#0369A1",
  "#166534",
  "#7DD3FC",
  "#14532D",
  "#475569",
];

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-space-900 px-3 py-2 text-xs shadow-lg">
      {payload.map((entry) => (
        <p key={entry.name} className="text-slate-200">
          <span className="text-slate-400">{entry.name}: </span>
          {entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function StatusDoughnut({
  data,
}: {
  data: AnalyticsResponse["charactersByStatus"];
}) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] ?? "#64748B"}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-2 flex justify-center gap-5 text-xs text-slate-400">
        {data.map((entry) => (
          <li key={entry.status} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[entry.status] }}
            />
            <span className="capitalize">{entry.status}</span>
            <span className="text-slate-500">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Horizontal bars instead of a treemap: Humans dominate the distribution
 * so heavily (366 of 826) that a treemap squeezes every other species
 * into unreadable slivers. Bars keep every label and count legible.
 */
export function SpeciesBars({
  data,
}: {
  data: AnalyticsResponse["topSpecies"];
}) {
  const max = data[0]?.count ?? 1;
  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <ol className="flex flex-col gap-2.5">
      {data.map((entry, index) => (
        <li key={entry.species} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-slate-300">
            {entry.species}
          </span>
          <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-space-800">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${(entry.count / max) * 100}%`,
                backgroundColor:
                  TREEMAP_COLORS[index % TREEMAP_COLORS.length],
              }}
            />
          </span>
          <span className="w-10 shrink-0 text-right font-mono text-xs text-portal-300">
            {entry.count}
          </span>
          <span className="w-10 shrink-0 text-right text-xs text-slate-500">
            {Math.round((entry.count / total) * 100)}%
          </span>
        </li>
      ))}
    </ol>
  );
}

export function CastSizeTimeline({
  data,
}: {
  data: AnalyticsResponse["episodeCastSizes"];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="castGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="code"
          interval={9}
          tick={{ fontSize: 10, fill: "#64748B" }}
          axisLine={{ stroke: "#1E293B" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CastTooltip />} />
        <Area
          type="monotone"
          dataKey="characterCount"
          name="Characters"
          stroke="#4ADE80"
          strokeWidth={2}
          fill="url(#castGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CastTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload as
    | AnalyticsResponse["episodeCastSizes"][number]
    | undefined;
  if (!point) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-space-900 px-3 py-2 text-xs shadow-lg">
      <p className="font-mono text-portal-300">{point.code}</p>
      <p className="mt-0.5 text-slate-200">{point.name}</p>
      <p className="mt-0.5 text-slate-400">{point.characterCount} characters</p>
    </div>
  );
}
