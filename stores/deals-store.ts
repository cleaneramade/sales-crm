import { useMemo } from "react";
import { create } from "zustand";
import {
  DEALS,
  type Deal,
  type DealActivityType,
  type DealStage,
} from "@/data/deals";
import type { ForecastCategory } from "@/data/forecast";
import { TODAY } from "@/lib/companies";
import {
  CLOSE_PUSH_DAYS,
  DEFAULT_DEAL_FILTERS,
  addDays,
  companySummaryMap,
  type DealFilters,
} from "@/lib/deals";

type DealsState = DealFilters & {
  deals: Deal[];
  detailId: string | null;
  detailOpen: boolean;
  newDealOpen: boolean;
  setSortBy: (sortBy: DealFilters["sortBy"]) => void;
  setOwner: (owner: string) => void;
  setMotion: (motion: string) => void;
  setCloseWindow: (closeWindow: DealFilters["closeWindow"]) => void;
  resetFilters: () => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
  setNewDealOpen: (open: boolean) => void;
  moveDeal: (id: string, stage: DealStage) => void;
  addDeal: (deal: Deal) => void;
  setCategory: (id: string, category: ForecastCategory) => void;
  logActivity: (id: string, type: DealActivityType) => void;
  setWinOverride: (id: string, win: number | null) => void;
};

export const useDealsStore = create<DealsState>((set) => ({
  deals: DEALS,
  ...DEFAULT_DEAL_FILTERS,
  detailId: null,
  detailOpen: false,
  newDealOpen: false,
  setSortBy: (sortBy) => set({ sortBy }),
  setOwner: (owner) => set({ owner }),
  setMotion: (motion) => set({ motion }),
  setCloseWindow: (closeWindow) => set({ closeWindow }),
  resetFilters: () => set({ ...DEFAULT_DEAL_FILTERS }),
  openDetail: (detailId) => set({ detailId, detailOpen: true }),
  closeDetail: () => set({ detailOpen: false }),
  setNewDealOpen: (newDealOpen) => set({ newDealOpen }),
  moveDeal: (id, stage) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === id && deal.stage !== stage
          ? {
              ...deal,
              stage,
              stageChangedAt: TODAY,
              winOverride: undefined,
            }
          : deal,
      ),
    })),
  addDeal: (deal) =>
    set((state) => ({
      deals: [deal, ...state.deals],
      newDealOpen: false,
    })),
  setCategory: (id, category) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === id ? { ...deal, category } : deal,
      ),
    })),
  logActivity: (id, type) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === id
          ? {
              ...deal,
              closeDate:
                type === "closePushed"
                  ? addDays(deal.closeDate, CLOSE_PUSH_DAYS)
                  : deal.closeDate,
              activity: [
                ...deal.activity,
                {
                  id: `${deal.id}-a${deal.activity.length + 1}-${Date.now()}`,
                  type,
                  date: TODAY,
                },
              ],
            }
          : deal,
      ),
    })),
  setWinOverride: (id, win) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === id ? { ...deal, winOverride: win ?? undefined } : deal,
      ),
    })),
}));

export function useCompanySummaries() {
  const deals = useDealsStore((state) => state.deals);
  return useMemo(() => companySummaryMap(deals), [deals]);
}
