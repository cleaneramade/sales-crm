"use client";

import { formatDate } from "@/lib/companies";
import { useForecastStore } from "@/stores/forecast-store";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";
import PendingDot from "@/public/assets/images/companies/sidebar/dot-yellow.svg";

export default function ForecastStatus() {
  const submission = useForecastStore(
    (state) => state.submissions[state.period],
  );

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      {submission ? (
        <ActiveDot aria-hidden className="size-3" />
      ) : (
        <PendingDot aria-hidden className="size-3" />
      )}
      {submission
        ? `Submitted ${formatDate(submission.date)}`
        : "Not submitted"}
    </span>
  );
}
