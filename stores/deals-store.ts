import { create } from "zustand";
import { DEALS, type Deal, type DealStage } from "@/data/deals";
import { DEFAULT_DEAL_FILTERS, type DealFilters } from "@/lib/deals";

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
        deal.id === id ? { ...deal, stage } : deal,
      ),
    })),
  addDeal: (deal) =>
    set((state) => ({
      deals: [deal, ...state.deals],
      newDealOpen: false,
    })),
}));
