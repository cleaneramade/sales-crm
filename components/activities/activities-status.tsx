"use client";

import { loggedToday } from "@/lib/activities";
import { useAllActivities } from "@/stores/activities-store";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

export default function ActivitiesStatus() {
  const count = loggedToday(useAllActivities());

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      <ActiveDot aria-hidden className="size-3" />
      {count} logged today
    </span>
  );
}
