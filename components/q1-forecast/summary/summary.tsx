"use client";

import { formatMoney } from "@/lib/companies";
import { HEALTHY_COVERAGE, formatQ1Coverage } from "@/lib/q1-forecast";
import { useQ1Report } from "@/stores/q1-forecast-store";

export default function Summary() {
  const { totals, openPipeline, weighted, coverage, needed } = useQ1Report();

  const tiles = [
    {
      key: "quota",
      label: "Q1 quota",
      value: `$${formatMoney(totals.quota)}`,
      note: "Jan to Mar 2027",
    },
    {
      key: "closed",
      label: "Closed Won",
      value: `$${formatMoney(totals.closed)}`,
      note: "Already booked",
    },
    {
      key: "commit",
      label: "Commit",
      value: `$${formatMoney(totals.commit)}`,
      note: "Likely to close",
    },
    {
      key: "bestCase",
      label: "Best Case",
      value: `$${formatMoney(totals.bestCase)}`,
      note: "Could close",
    },
    {
      key: "pipeline",
      label: "Pipeline",
      value: `$${formatMoney(totals.pipeline)}`,
      note: "Early stage",
    },
    {
      key: "weighted",
      label: "Weighted",
      value: `$${formatMoney(Math.round(weighted))}`,
      note: "Value times win chance",
    },
    {
      key: "coverage",
      label: "Coverage",
      value: formatQ1Coverage(coverage),
      note: `$${formatMoney(openPipeline)} vs. quota`,
    },
    {
      key: "needed",
      label: `Needed for ${HEALTHY_COVERAGE}x`,
      value: `$${formatMoney(needed)}`,
      note: "More pipeline to add",
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="border-line-strong flex min-w-0 flex-col gap-3 rounded-lg border p-[11px]"
        >
          <span className="caption-style text-soft block">{tile.label}</span>
          <span className="lead-style block truncate tabular-nums">
            {tile.value}
          </span>
          <span className="caption-style text-soft block truncate">
            {tile.note}
          </span>
        </div>
      ))}
    </div>
  );
}
