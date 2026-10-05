"use client";

import { useMemo } from "react";
import SegmentBar from "@/components/_common/segment-bar";
import { formatMoney } from "@/lib/companies";
import {
  gapToQuota,
  quarterById,
  repRollups,
  teamTotals,
} from "@/lib/forecast";
import { useDealsStore } from "@/stores/deals-store";
import { useForecastStore } from "@/stores/forecast-store";

export default function Summary() {
  const deals = useDealsStore((state) => state.deals);
  const period = useForecastStore((state) => state.period);
  const owner = useForecastStore((state) => state.owner);

  const totals = useMemo(
    () => teamTotals(repRollups(deals, period, owner)),
    [deals, period, owner],
  );
  const gap = gapToQuota(totals);
  const ahead = totals.closed + totals.commit - totals.quota;

  const tiles = [
    {
      key: "quota",
      label: "Quota",
      value: totals.quota,
      note: quarterById(period).label,
    },
    {
      key: "closed",
      label: "Closed Won",
      value: totals.closed,
      attainment: totals.attainment,
    },
    {
      key: "commit",
      label: "Commit",
      value: totals.commit,
      note: "Likely to close",
    },
    {
      key: "bestCase",
      label: "Best Case",
      value: totals.bestCase,
      note: "Could close",
    },
    {
      key: "pipeline",
      label: "Pipeline",
      value: totals.pipeline,
      note: "Early stage",
    },
    {
      key: "gap",
      label: "Gap to quota",
      value: gap,
      note:
        gap === 0 ? `Ahead by $${formatMoney(ahead)}` : "After closed + commit",
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-3 xl:grid-cols-6">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="border-line-strong flex min-w-0 flex-col gap-3 rounded-lg border p-[11px]"
        >
          <span className="caption-style text-soft block">{tile.label}</span>
          <span className="lead-style block truncate tabular-nums">
            ${formatMoney(tile.value)}
          </span>
          {tile.attainment !== undefined ? (
            <span className="flex items-center gap-2">
              <SegmentBar
                percent={tile.attainment}
                segments={12}
                className="min-w-0 flex-1"
              />
              <span className="caption-style text-soft tabular-nums">
                {tile.attainment}%
              </span>
            </span>
          ) : (
            <span className="caption-style text-soft block truncate">
              {tile.note}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
