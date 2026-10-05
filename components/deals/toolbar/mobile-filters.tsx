"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/_ui/avatar";
import Button from "@/components/_ui/button";
import CountBadge from "@/components/_ui/count-badge";
import Field from "@/components/_ui/field";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/_ui/sheet";
import {
  CLOSE_WINDOW_OPTIONS,
  DEAL_OWNER_OPTIONS,
  DEAL_SORT_MENU_OPTIONS,
  MOTION_OPTIONS,
} from "./filter-options";
import { ownerByName } from "@/data/companies";
import type { CloseWindow, DealSortKey } from "@/data/deals";
import {
  ALL_DEAL_OWNERS,
  DEFAULT_DEAL_FILTERS,
  dealActiveFilterCount,
  filterDeals,
} from "@/lib/deals";
import { cn } from "@/lib/utils";
import { useDealsStore } from "@/stores/deals-store";
import FilterIcon from "@/public/assets/images/_common/filter.svg";
import XIcon from "@/public/assets/images/companies/detail/x.svg";

type MobileFiltersProps = {
  className?: string;
};

export default function MobileFilters({ className }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);
  const deals = useDealsStore((state) => state.deals);
  const sortBy = useDealsStore((state) => state.sortBy);
  const owner = useDealsStore((state) => state.owner);
  const motion = useDealsStore((state) => state.motion);
  const closeWindow = useDealsStore((state) => state.closeWindow);
  const setSortBy = useDealsStore((state) => state.setSortBy);
  const setOwner = useDealsStore((state) => state.setOwner);
  const setMotion = useDealsStore((state) => state.setMotion);
  const setCloseWindow = useDealsStore((state) => state.setCloseWindow);
  const resetFilters = useDealsStore((state) => state.resetFilters);

  const activeCount = dealActiveFilterCount({
    sortBy,
    owner,
    motion,
    closeWindow,
  });
  const resultCount = useMemo(
    () => filterDeals(deals, { sortBy, owner, motion, closeWindow }).length,
    [deals, sortBy, owner, motion, closeWindow],
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={
          activeCount > 0 ? `Filters, ${activeCount} active` : "Filters"
        }
        className={cn("data-[active=true]:bg-muted", className)}
        data-active={activeCount > 0}
      >
        <FilterIcon aria-hidden className="size-3" />
        Filters
        {activeCount > 0 && <CountBadge>{activeCount}</CountBadge>}
      </Button>

      <SheetContent side="bottom">
        <SheetHeader className="px-4">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">
            Sort and filter the deals board
          </SheetDescription>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="-mr-1"
              aria-label="Close filters"
            >
              <XIcon aria-hidden className="text-foreground size-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <ScrollArea viewportClassName="max-h-[calc(85dvh-118px)]">
          <div className="flex flex-col gap-4 p-4">
            <Field label="Sort by" htmlFor="mobile-deal-sort">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as DealSortKey)}
              >
                <SelectTrigger id="mobile-deal-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_SORT_MENU_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Deal owner" htmlFor="mobile-deal-owner">
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger id="mobile-deal-owner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_OWNER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value === ALL_DEAL_OWNERS ? (
                        option.label
                      ) : (
                        <span className="flex items-center gap-2">
                          <Avatar
                            src={ownerByName(option.value).avatar}
                            alt=""
                          />
                          {option.label}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Motion" htmlFor="mobile-deal-motion">
              <Select value={motion} onValueChange={setMotion}>
                <SelectTrigger id="mobile-deal-motion">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Close date" htmlFor="mobile-deal-close">
              <Select
                value={closeWindow}
                onValueChange={(value) => setCloseWindow(value as CloseWindow)}
              >
                <SelectTrigger id="mobile-deal-close">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLOSE_WINDOW_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </ScrollArea>

        <SheetFooter className="px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={
              activeCount === 0 && sortBy === DEFAULT_DEAL_FILTERS.sortBy
            }
            className="-ml-1.5"
          >
            Reset
          </Button>
          <SheetClose asChild>
            <Button variant="primary" size="sm">
              Show {resultCount} {resultCount === 1 ? "deal" : "deals"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
