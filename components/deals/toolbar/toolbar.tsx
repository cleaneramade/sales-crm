"use client";

import Button from "@/components/_ui/button";
import FilterMenu from "@/components/_common/filter-menu";
import MobileFilters from "./mobile-filters";
import {
  CLOSE_WINDOW_OPTIONS,
  DEAL_OWNER_OPTIONS,
  DEAL_SORT_MENU_OPTIONS,
  MOTION_OPTIONS,
} from "./filter-options";
import type { CloseWindow, DealSortKey } from "@/data/deals";
import { TODAY } from "@/lib/companies";
import { downloadCsv } from "@/lib/csv";
import { dealsCsvRows, visibleDeals } from "@/lib/deals";
import { useCompaniesStore } from "@/stores/companies-store";
import { useDealsStore } from "@/stores/deals-store";
import ShareIcon from "@/public/assets/images/companies/toolbar/share.svg";
import PlusIcon from "@/public/assets/images/_common/plus.svg";

export default function DealsToolbar() {
  const sortBy = useDealsStore((state) => state.sortBy);
  const owner = useDealsStore((state) => state.owner);
  const motion = useDealsStore((state) => state.motion);
  const closeWindow = useDealsStore((state) => state.closeWindow);
  const setSortBy = useDealsStore((state) => state.setSortBy);
  const setOwner = useDealsStore((state) => state.setOwner);
  const setMotion = useDealsStore((state) => state.setMotion);
  const setCloseWindow = useDealsStore((state) => state.setCloseWindow);
  const setNewDealOpen = useDealsStore((state) => state.setNewDealOpen);

  function exportCsv() {
    const { deals } = useDealsStore.getState();
    const { companies } = useCompaniesStore.getState();
    const visible = visibleDeals(deals, {
      sortBy,
      owner,
      motion,
      closeWindow,
    });
    downloadCsv(
      `deals-${TODAY}.csv`,
      dealsCsvRows(
        visible,
        (companyId) =>
          companies.find((company) => company.id === companyId)?.name ??
          companyId,
      ),
    );
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-4 py-4">
      <MobileFilters className="sm:hidden" />

      <div className="hidden min-w-0 flex-wrap gap-2 sm:flex">
        <FilterMenu
          label="Sort by"
          value={sortBy}
          options={DEAL_SORT_MENU_OPTIONS}
          onChange={(value) => setSortBy(value as DealSortKey)}
        />
        <FilterMenu
          label="Filter"
          value={owner}
          options={DEAL_OWNER_OPTIONS}
          onChange={setOwner}
        />
        <FilterMenu
          label="Motion"
          value={motion}
          options={MOTION_OPTIONS}
          onChange={setMotion}
        />
        <FilterMenu
          label="Close Date"
          value={closeWindow}
          options={CLOSE_WINDOW_OPTIONS}
          onChange={(value) => setCloseWindow(value as CloseWindow)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button variant="secondary" size="sm" onClick={exportCsv}>
          <ShareIcon aria-hidden className="size-3" />
          Export
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setNewDealOpen(true)}
        >
          <PlusIcon aria-hidden className="size-3" />
          New Deal
        </Button>
      </div>
    </div>
  );
}
