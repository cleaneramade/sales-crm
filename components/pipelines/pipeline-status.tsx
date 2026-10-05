"use client";

import type { Region } from "@/data/deals";
import { regionOpenCount } from "@/lib/pipelines";
import { useDealsStore } from "@/stores/deals-store";
import ActiveDot from "@/public/assets/images/companies/header/active-dot.svg";

type PipelineStatusProps = {
  region: Region;
};

export default function PipelineStatus({ region }: PipelineStatusProps) {
  const count = useDealsStore((state) => regionOpenCount(state.deals, region));

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      <ActiveDot aria-hidden className="size-3" />
      {count} open {count === 1 ? "deal" : "deals"}
    </span>
  );
}
