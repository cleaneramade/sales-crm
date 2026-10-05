"use client";

import { useSlippingReport } from "@/stores/slipping-store";
import PendingDot from "@/public/assets/images/companies/sidebar/dot-yellow.svg";

export default function SlippingStatus() {
  const { all } = useSlippingReport();

  return (
    <span className="caption-style bg-muted inline-flex shrink-0 items-center gap-0.5 rounded-full border border-[#363636] py-[3px] pr-[5px] pl-[3px]">
      {all.length > 0 ? (
        <PendingDot aria-hidden className="size-3" />
      ) : (
        <span aria-hidden className="size-3" />
      )}
      {all.length} slipping
    </span>
  );
}
