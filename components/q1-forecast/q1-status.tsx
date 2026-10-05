"use client";

import { HEALTHY_COVERAGE, formatQ1Coverage } from "@/lib/q1-forecast";
import { useQ1Report } from "@/stores/q1-forecast-store";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";
import PendingDot from "@/public/assets/images/companies/sidebar/dot-yellow.svg";

export default function Q1Status() {
  const { coverage, openPipeline } = useQ1Report();
  const needsPipeline = openPipeline === 0 || (coverage ?? 0) < 1;
  const healthy = (coverage ?? 0) >= HEALTHY_COVERAGE;
  const label =
    openPipeline === 0
      ? "Needs pipeline"
      : coverage === null
        ? "No quota"
        : `Coverage ${formatQ1Coverage(coverage)}`;

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      {needsPipeline ? (
        <PendingDot aria-hidden className="size-3" />
      ) : healthy ? (
        <ActiveDot aria-hidden className="size-3" />
      ) : (
        <span aria-hidden className="size-3" />
      )}
      {label}
    </span>
  );
}
