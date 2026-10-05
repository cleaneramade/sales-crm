"use client";

import { useMemo } from "react";
import { CURRENT_QUARTER_ID } from "@/data/forecast";
import type { Region } from "@/data/deals";
import { formatMoney } from "@/lib/companies";
import { quarterById } from "@/lib/forecast";
import { pipelineSummary } from "@/lib/pipelines";
import { useDealsStore } from "@/stores/deals-store";

type PipelineSummaryProps = {
  region: Region;
};

export default function PipelineSummary({ region }: PipelineSummaryProps) {
  const deals = useDealsStore((state) => state.deals);
  const summary = useMemo(
    () => pipelineSummary(deals, region),
    [deals, region],
  );
  const quarter = quarterById(CURRENT_QUARTER_ID).label;

  const tiles = [
    {
      key: "open",
      label: "Open pipeline",
      value: `$${formatMoney(summary.openValue)}`,
      note: `${summary.openCount} open ${summary.openCount === 1 ? "deal" : "deals"}`,
    },
    {
      key: "weighted",
      label: "Weighted",
      value: `$${formatMoney(summary.weighted)}`,
      note: "Value times win chance",
    },
    {
      key: "avgWin",
      label: "Avg win",
      value: summary.avgWin === null ? "—" : `${summary.avgWin}%`,
      note: "Bigger deals count more",
    },
    {
      key: "won",
      label: "Won this quarter",
      value: `$${formatMoney(summary.wonValue)}`,
      note: `${summary.wonCount} ${summary.wonCount === 1 ? "deal" : "deals"} in ${quarter}`,
    },
    {
      key: "winRate",
      label: "Win rate",
      value: summary.winRate === null ? "—" : `${summary.winRate}%`,
      note: "Won of won and lost",
    },
    {
      key: "stale",
      label: "Stale deals",
      value: String(summary.staleCount),
      note: "No recent activity",
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-3 lg:grid-cols-6">
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
