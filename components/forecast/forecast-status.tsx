"use client";

import { formatDate } from "@/lib/companies";
import { useForecastStore } from "@/stores/forecast-store";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

export default function ForecastStatus() {
  const submission = useForecastStore(
    (state) => state.submissions[state.period],
  );

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      <ActiveDot aria-hidden className="size-3" />
      {submission
        ? `Submitted ${formatDate(submission.date)}`
        : "Not submitted"}
    </span>
  );
}
