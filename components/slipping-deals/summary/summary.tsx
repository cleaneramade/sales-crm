"use client";

import { formatMoney } from "@/lib/companies";
import { cn } from "@/lib/utils";
import { useSlippingReport } from "@/stores/slipping-store";

export default function Summary() {
  const { summary } = useSlippingReport();

  const tiles = [
    {
      key: "count",
      label: "Slipping deals",
      value: String(summary.count),
      note: "Pushed or past due",
    },
    {
      key: "value",
      label: "Value at risk",
      value: `$${formatMoney(summary.value)}`,
      note: "Open deal value",
    },
    {
      key: "avgDays",
      label: "Avg days slipped",
      value: `${summary.avgDays}d`,
      note: "Across pushed deals",
    },
    {
      key: "pushed",
      label: "Pushed this quarter",
      value: String(summary.pushedThisQuarter),
      note: "Q3 2026 pushes",
    },
    {
      key: "pastDue",
      label: "Past due",
      value: String(summary.pastDueCount),
      note: `$${formatMoney(summary.pastDueValue)} overdue`,
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-5">
      {tiles.map((tile, index) => (
        <div
          key={tile.key}
          className={cn(
            "border-line-strong flex min-w-0 flex-col gap-3 rounded-lg border p-[11px]",
            index === tiles.length - 1 && "col-span-2 sm:col-span-1",
          )}
        >
          <span className="caption-style text-soft block truncate">
            {tile.label}
          </span>
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
